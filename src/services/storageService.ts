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

const BOOKS_KEY = 'librarytrix:books';
const CATEGORIES_KEY = 'librarytrix:categories';

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

/** Leitura síncrona imediata (localStorage já pré-carregado com o seed). */
export function loadLocal(): { books: Book[]; categories: Category[] } {
  const rawBooks = readLocal<Book[]>(BOOKS_KEY, SEED_BOOKS);
  const books = rawBooks.map((b) => ({
    ...b,
    id: b.id.replace('ARCHIVE_ID // ', 'ID_ARQUIVO // '),
    originalNationality: b.originalNationality === 'UK' ? 'REINO UNIDO' : b.originalNationality,
  }));
  return {
    books,
    categories: readLocal<Category[]>(CATEGORIES_KEY, SEED_CATEGORIES),
  };
}

/**
 * Sincroniza com o Firestore (quando configurado). Se a nuvem estiver vazia,
 * envia os dados locais; caso contrário, a nuvem vence e atualiza o cache local.
 */
export async function syncFromCloud(): Promise<{
  books: Book[];
  categories: Category[];
  state: SyncState;
}> {
  const local = loadLocal();
  if (!db) return { ...local, state: 'LOCAL' };
  try {
    const [bookSnap, catSnap] = await Promise.all([
      getDocs(collection(db, 'books')),
      getDocs(collection(db, 'categories')),
    ]);
    if (bookSnap.empty && catSnap.empty) {
      const batch = writeBatch(db);
      local.books.forEach((b) => batch.set(doc(db!, 'books', docId(b.id)), b));
      local.categories.forEach((c) => batch.set(doc(db!, 'categories', docId(c.id)), c));
      await batch.commit();
      return { ...local, state: 'CLOUD' };
    }
    const books = bookSnap.docs.map((d) => d.data() as Book);
    const categories = catSnap.docs.map((d) => d.data() as Category);
    const merged = {
      books: books.length ? books : local.books,
      categories: categories.length ? categories : local.categories,
    };
    writeLocal(BOOKS_KEY, merged.books);
    writeLocal(CATEGORIES_KEY, merged.categories);
    return { ...merged, state: 'CLOUD' };
  } catch (err) {
    console.warn('[Librarytrix] Firestore indisponível, modo offline.', err);
    return { ...local, state: 'OFFLINE' };
  }
}

/** Persiste a lista completa localmente e tenta espelhar os itens alterados na nuvem. */
export async function persistBooks(
  books: Book[],
  changed?: Book | Book[],
  removedId?: string,
): Promise<SyncState> {
  writeLocal(BOOKS_KEY, books);
  if (!db) return 'LOCAL';
  try {
    const list = changed ? (Array.isArray(changed) ? changed : [changed]) : [];
    await Promise.all(list.map((b) => setDoc(doc(db!, 'books', docId(b.id)), b)));
    if (removedId) await deleteDoc(doc(db, 'books', docId(removedId)));
    return 'CLOUD';
  } catch {
    return 'OFFLINE';
  }
}

/**
 * Exclui uma categoria preservando a integridade: livros vinculados são
 * reatribuídos à categoria `fallback` (GERAL), criada se ainda não existir.
 */
export async function removeCategory(
  books: Book[],
  categories: Category[],
  target: Category,
  fallback: Category,
): Promise<{ books: Book[]; categories: Category[]; state: SyncState }> {
  const affected = books.filter((b) => b.category === target.name);
  const nextBooks = books.map((b) => (b.category === target.name ? { ...b, category: fallback.name } : b));
  let nextCats = categories.filter((c) => c.id !== target.id);
  const needsFallback = affected.length > 0 && !nextCats.some((c) => c.name === fallback.name);
  if (needsFallback) nextCats = [...nextCats, fallback];

  const s1 = await persistCategories(nextCats, needsFallback ? fallback : undefined, target.id);
  const s2 = await persistBooks(nextBooks, affected.map((b) => ({ ...b, category: fallback.name })));
  return { books: nextBooks, categories: nextCats, state: s1 === 'OFFLINE' || s2 === 'OFFLINE' ? 'OFFLINE' : s2 };
}

export async function persistCategories(
  categories: Category[],
  changed?: Category,
  removedId?: string,
): Promise<SyncState> {
  writeLocal(CATEGORIES_KEY, categories);
  if (!db) return 'LOCAL';
  try {
    if (changed) await setDoc(doc(db, 'categories', docId(changed.id)), changed);
    if (removedId) await deleteDoc(doc(db, 'categories', docId(removedId)));
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

/** Baixa o backup completo do acervo em .json. */
export function exportJson(books: Book[], categories: Category[]) {
  const payload = {
    app: 'librarytrix',
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

