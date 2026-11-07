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
import type { Book, Category, SyncState } from '../types';

/** Chaves de armazenamento local isoladas por UID do usuário autenticado. */
export const booksKey = (uid: string) => `librarytrix_books_${uid}`;
export const categoriesKey = (uid: string) => `librarytrix_categories_${uid}`;

/** IDs de documento do Firestore não aceitam "/" — o `id` de exibição fica no campo. */
const docId = (id: string) => id.replace(/[^a-zA-Z0-9-]+/g, '_');

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
export function loadLocal(uid: string): { books: Book[]; categories: Category[] } {
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
 * com o Firestore. Se a subcoleção da conta na nuvem estiver vazia, envia o seed inicial.
 */
export async function syncFromCloud(uid: string): Promise<{
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
  const stamped = books.map((b) => ({ ...b, userId: uid }));
  writeLocal(booksKey(uid), stamped);
  if (!db) return 'LOCAL';
  try {
    const list = changed ? (Array.isArray(changed) ? changed : [changed]) : [];
    await Promise.all(
      list.map((b) => setDoc(doc(db!, 'users', uid, 'books', docId(b.id)), { ...b, userId: uid })),
    );
    if (removedId) await deleteDoc(doc(db, 'users', uid, 'books', docId(removedId)));
    return 'CLOUD';
  } catch {
    return 'OFFLINE';
  }
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
  fallback: Category,
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
  const payload = {
    app: 'librarytrix',
    operator: operatorName ?? 'OPERADOR',
    exportedAt: new Date().toISOString(),
    categories,
    books,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `librarytrix-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
