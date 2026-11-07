import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { SEED_BOOKS, SEED_CATEGORIES } from './seed';
import {
  DEFAULT_CATEGORY,
  MAX_CRITIQUE_CHARS,
  type Book,
  type Category,
  type SyncState,
} from '../types';
import { normalizeHex, stats } from '../utils';

/** Chaves de armazenamento local isoladas por UID do usuário autenticado. */
export const booksKey = (uid: string) => `librarytrix_books_${uid}`;
export const categoriesKey = (uid: string) => `librarytrix_categories_${uid}`;

/** IDs de documento do Firestore não aceitam "/" — o `id` de exibição fica no campo. */
const docId = (id: string) => id.replace(/[^a-zA-Z0-9-]+/g, '_');

/** Valida integridade de um livro antes de persistir (nota 0–5 e crítica <= 1000 chars). */
export function validateBook(book: Book): void {
  if (!book.title || !book.title.trim()) {
    throw new Error('ERRO: O título do livro é obrigatório.');
  }
  if (!book.author || !book.author.trim()) {
    throw new Error('ERRO: O autor do livro é obrigatório.');
  }
  if (typeof book.rating !== 'number' || Number.isNaN(book.rating) || book.rating < 0 || book.rating > 5) {
    throw new Error('ERRO: A nota do livro deve estar entre 0.0 e 5.0.');
  }
  if (typeof book.critique === 'string' && book.critique.length > MAX_CRITIQUE_CHARS) {
    throw new Error(`ERRO: A crítica excede o limite máximo de ${MAX_CRITIQUE_CHARS} caracteres.`);
  }
}

/** Valida integridade de uma categoria antes de persistir (nome e cor hexadecimal). */
export function validateCategory(category: Category, existing: Category[] = []): Category {
  if (!category.name || !category.name.trim()) {
    throw new Error('ERRO: O nome da categoria é obrigatório.');
  }
  const normalizedColor = normalizeHex(category.color);
  if (!normalizedColor) {
    throw new Error('ERRO: Código de cor hexadecimal inválido (use #RGB ou #RRGGBB).');
  }
  if (!category.suffix || category.suffix.trim().length < 2 || category.suffix.trim().length > 4) {
    throw new Error('ERRO: O sufixo de protocolo deve ter entre 2 e 4 caracteres.');
  }
  const duplicate = existing.some(
    (c) => c.id !== category.id && c.name.trim().toLowerCase() === category.name.trim().toLowerCase(),
  );
  if (duplicate) {
    throw new Error('ERRO: Já existe uma categoria com este nome.');
  }
  return {
    ...category,
    name: category.name.trim(),
    color: normalizedColor,
    suffix: category.suffix.trim().toUpperCase(),
  };
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* JSON corrompido: recai para o seed */
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

function writeLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Leitura síncrona imediata para a conta do usuário autenticado (`uid`).
 * Se for o primeiro acesso da conta, inicializa com as 5 categorias padrão e o seed inicial
 * de forma totalmente isolada das demais contas.
 */
export function loadLocal(uid = 'default'): { books: Book[]; categories: Category[] } {
  const initialBooks = SEED_BOOKS.map((b) => ({ ...b, userId: uid }));
  const initialCats = SEED_CATEGORIES.map((c) => ({ ...c, userId: uid }));

  const rawBooks = readLocal<Book[]>(booksKey(uid), initialBooks);
  const books = rawBooks.map((b) => ({
    ...b,
    userId: uid,
    id: b.id.replace('ARCHIVE_ID // ', 'ID_ARQUIVO // '),
    originalNationality: b.originalNationality === 'UK' ? 'REINO UNIDO' : b.originalNationality,
  }));
  const categories = readLocal<Category[]>(categoriesKey(uid), initialCats).map((c) => ({
    ...c,
    userId: uid,
  }));

  return { books, categories };
}

/**
 * Sincroniza o acervo isolado do usuário (`users/{uid}/books` e `users/{uid}/categories`)
 * com o Firestore. Se a subcoleção da nuvem estiver vazia, envia o seed inicial.
 */
export async function syncFromCloud(uid = 'default'): Promise<{
  books: Book[];
  categories: Category[];
  state: SyncState;
}> {
  const local = loadLocal(uid);
  if (!db) return { ...local, state: 'LOCAL' };
  try {
    const userBooksCol = collection(db, 'users', uid, 'books');
    const userCatsCol = collection(db, 'users', uid, 'categories');
    const [bookSnap, catSnap] = await Promise.all([getDocs(userBooksCol), getDocs(userCatsCol)]);

    if (bookSnap.empty && catSnap.empty) {
      const batch = writeBatch(db);
      local.books.forEach((b) =>
        batch.set(doc(db!, 'users', uid, 'books', docId(b.id)), { ...b, userId: uid }),
      );
      local.categories.forEach((c) =>
        batch.set(doc(db!, 'users', uid, 'categories', docId(c.id)), { ...c, userId: uid }),
      );
      await batch.commit();
      return { ...local, state: 'CLOUD' };
    }

    const books = bookSnap.docs.map((d) => ({ ...(d.data() as Book), userId: uid }));
    const categories = catSnap.docs.map((d) => ({ ...(d.data() as Category), userId: uid }));
    const merged = {
      books: books.length ? books : local.books,
      categories: categories.length ? categories : local.categories,
    };
    writeLocal(booksKey(uid), merged.books);
    writeLocal(categoriesKey(uid), merged.categories);
    return { ...merged, state: 'CLOUD' };
  } catch (err) {
    console.warn('[Librarytrix] Firestore indisponível, operando em modo offline isolado.', err);
    return { ...local, state: 'OFFLINE' };
  }
}

/** Persiste a lista completa no cache isolado do usuário e espelha em `users/{uid}/books`. */
export async function persistBooks(
  uid: string,
  books: Book[],
  changed?: Book | Book[],
  removedId?: string,
): Promise<SyncState> {
  const list = changed ? (Array.isArray(changed) ? changed : [changed]) : [];
  list.forEach(validateBook);
  books.forEach(validateBook);

  const stamped = books.map((b) => ({ ...b, userId: uid }));
  writeLocal(booksKey(uid), stamped);
  if (!db) return 'LOCAL';
  try {
    await Promise.all(
      list.map((b) => setDoc(doc(db!, 'users', uid, 'books', docId(b.id)), { ...b, userId: uid })),
    );
    if (removedId) await deleteDoc(doc(db, 'users', uid, 'books', docId(removedId)));
    return 'CLOUD';
  } catch {
    return 'OFFLINE';
  }
}

/** Cadastra ou atualiza um livro na conta do usuário validando regras de negócio. */
export async function saveBookForUser(uid: string, book: Book): Promise<Book[]> {
  validateBook(book);
  const { books } = loadLocal(uid);
  const stamped: Book = { ...book, userId: uid };
  const exists = books.some((b) => b.id === stamped.id);
  const next = exists ? books.map((b) => (b.id === stamped.id ? stamped : b)) : [stamped, ...books];
  await persistBooks(uid, next, stamped);
  return next;
}

/** Remove um livro por ID da conta do usuário. */
export async function deleteBookForUser(uid: string, bookId: string): Promise<Book[]> {
  const { books } = loadLocal(uid);
  const next = books.filter((b) => b.id !== bookId);
  await persistBooks(uid, next, undefined, bookId);
  return next;
}

/** Cria uma nova categoria customizada validando formato hexadecimal. */
export async function createCategoryForUser(uid: string, category: Category): Promise<Category[]> {
  const { categories } = loadLocal(uid);
  const validated = validateCategory({ ...category, userId: uid }, categories);
  const next = [...categories, validated];
  await persistCategories(uid, next, validated);
  return next;
}

/**
 * Exclui uma categoria do usuário preservando a integridade: livros vinculados são
 * reatribuídos à categoria `fallback` (GERAL), criada se ainda não existir.
 */
export async function removeCategory(
  uid: string,
  books: Book[],
  categories: Category[],
  target: Category,
  fallback: Category = DEFAULT_CATEGORY,
): Promise<{ books: Book[]; categories: Category[]; state: SyncState }> {
  const affected = books.filter((b) => b.category === target.name);
  const nextBooks = books.map((b) =>
    b.category === target.name ? { ...b, category: fallback.name, userId: uid } : b,
  );
  let nextCats = categories.filter((c) => c.id !== target.id);
  const stampedFallback = { ...fallback, userId: uid };
  const needsFallback = affected.length > 0 && !nextCats.some((c) => c.name === fallback.name);
  if (needsFallback) nextCats = [...nextCats, stampedFallback];

  const s1 = await persistCategories(uid, nextCats, needsFallback ? stampedFallback : undefined, target.id);
  const s2 = await persistBooks(
    uid,
    nextBooks,
    affected.map((b) => ({ ...b, category: fallback.name, userId: uid })),
  );
  return {
    books: nextBooks,
    categories: nextCats,
    state: s1 === 'OFFLINE' || s2 === 'OFFLINE' ? 'OFFLINE' : s2,
  };
}

/** Persiste as categorias no cache isolado do usuário e espelha em `users/{uid}/categories`. */
export async function persistCategories(
  uid: string,
  categories: Category[],
  changed?: Category,
  removedId?: string,
): Promise<SyncState> {
  if (changed) validateCategory(changed);
  categories.forEach((c) => validateCategory(c));

  const stamped = categories.map((c) => ({ ...c, userId: uid }));
  writeLocal(categoriesKey(uid), stamped);
  if (!db) return 'LOCAL';
  try {
    if (changed) {
      await setDoc(doc(db, 'users', uid, 'categories', docId(changed.id)), {
        ...changed,
        userId: uid,
      });
    }
    if (removedId) await deleteDoc(doc(db, 'users', uid, 'categories', docId(removedId)));
    return 'CLOUD';
  } catch {
    return 'OFFLINE';
  }
}

/** Calcula as métricas de telemetria global e contextual por categoria. */
export function calculateTelemetry(
  books: Book[],
  categories: Category[],
  selectedCategory: string | null = null,
) {
  const base = stats(books, categories);
  const categoryBooks = selectedCategory
    ? books.filter((b) => b.category === selectedCategory)
    : books;
  const ratedCategory = categoryBooks.filter((b) => b.rating > 0);
  const categoryAvg = ratedCategory.length
    ? ratedCategory.reduce((s, b) => s + b.rating, 0) / ratedCategory.length
    : 0;

  return {
    totalVolumes: base.total,
    globalAverage: Number(base.avg.toFixed(2)),
    categoryAverage: Number(categoryAvg.toFixed(2)),
    categoryVolumesCount: categoryBooks.length,
    dominantCategory: base.dominant?.cat.name ?? null,
    dominantPercentage: base.dominantPct,
    latestBook: base.latestBook,
  };
}

/** Gera a estrutura JSON serializada de backup do acervo. */
export function buildExportPayload(books: Book[], categories: Category[], operatorName = 'OPERADOR'): string {
  const payload = {
    app: 'librarytrix',
    operator: operatorName,
    exportedAt: new Date().toISOString(),
    categories,
    books,
  };
  return JSON.stringify(payload, null, 2);
}

/** Gera o próximo ID_ARQUIVO, ex.: `ID_ARQUIVO // 0843-CYB`. */
export function nextArchiveId(books: Book[], suffix: string): string {
  const max = books.reduce((acc, b) => {
    const m = /\/\/ (\d+)-/.exec(b.id);
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
  }, 0);
  return `ID_ARQUIVO // ${String(max + 1).padStart(4, '0')}-${suffix}`;
}

/** Baixa o backup completo do acervo do operador autenticado em .json. */
export function exportJson(books: Book[], categories: Category[], operatorName?: string) {
  const jsonString = buildExportPayload(books, categories, operatorName);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `librarytrix-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
