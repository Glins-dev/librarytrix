import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TelemetryStrip from './components/TelemetryStrip';
import FilterBar from './components/FilterBar';
import BookCard from './components/BookCard';
import NewBookModal from './components/NewBookModal';
import NewCategoryModal from './components/NewCategoryModal';
import CritiqueModal from './components/CritiqueModal';
import RankingView from './components/RankingView';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import {
  exportJson,
  loadLocal,
  persistBooks,
  persistCategories,
  removeCategory,
  syncFromCloud,
} from './services/storageService';
import { SEED_BOOKS, SEED_CATEGORIES } from './services/seed';
import { DEFAULT_CATEGORY, type Book, type Category, type FilterState, type SyncState, type ViewKey } from './types';
import ConfirmCategoryDelete from './components/ConfirmCategoryDelete';
import { formatNationality, normalize } from './utils';

const initialFilter: FilterState = { category: null, minRating: 0, nationality: null, search: '', sort: 'score_desc' };

export default function App() {
  const [{ books: b0, categories: c0 }] = useState(loadLocal);
  const [books, setBooks] = useState<Book[]>(b0);
  const [categories, setCategories] = useState<Category[]>(c0);
  const [sync, setSync] = useState<SyncState>('LOCAL');
  const [view, setView] = useState<ViewKey>('catalog');
  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  const [bookModal, setBookModal] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [catModal, setCatModal] = useState(false);
  const [critiqueBook, setCritiqueBook] = useState<Book | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sincronização inicial com o Firestore (se configurado)
  useEffect(() => {
    syncFromCloud().then((r) => {
      setBooks(r.books);
      setCategories(r.categories);
      setSync(r.state);
    });
  }, []);

  // Atalhos: CTRL/⌘+K (busca) e ALT+N (nova categoria)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setView('catalog');
        if (searchRef.current && searchRef.current.offsetParent !== null) {
          searchRef.current.focus();
        } else {
          const mobileInput = document.getElementById('mobile-search-input') as HTMLInputElement | null;
          mobileInput?.focus();
        }
      }
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setCatModal(true);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const patchFilter = useCallback((p: Partial<FilterState>) => setFilter((f) => ({ ...f, ...p })), []);

  const clearAllFilters = useCallback(() => {
    setFilter(initialFilter);
    setSearchQuery('');
  }, []);

  const saveBook = async (book: Book) => {
    const exists = books.some((b) => b.id === book.id);
    const next = exists ? books.map((b) => (b.id === book.id ? book : b)) : [book, ...books];
    setBooks(next);
    setSync(await persistBooks(next, book));
  };

  const deleteBook = async (book: Book) => {
    if (!window.confirm(`Excluir "${book.title}" do acervo?`)) return;
    const next = books.filter((b) => b.id !== book.id);
    setBooks(next);
    setSync(await persistBooks(next, undefined, book.id));
  };

  const createCategory = async (c: Category) => {
    const next = [...categories, c];
    setCategories(next);
    setSync(await persistCategories(next, c));
  };

  const confirmDeleteCategory = async () => {
    const target = deleteCat;
    if (!target) return;
    setDeleteCat(null);
    const r = await removeCategory(books, categories, target, DEFAULT_CATEGORY);
    setBooks(r.books);
    setCategories(r.categories);
    setSync(r.state);
    if (filter.category === target.name) patchFilter({ category: null });
  };

  const purge = async () => {
    if (!window.confirm('LIMPAR DADOS LOCAIS: restaurar o acervo inicial (6 livros)? Alterações locais serão perdidas.')) return;
    setBooks(SEED_BOOKS);
    setCategories(SEED_CATEGORIES);
    await persistCategories(SEED_CATEGORIES);
    setSync(await persistBooks(SEED_BOOKS));
  };

  const filteredBooks = useMemo(() => {
    const q = normalize(searchQuery.trim());
    const list = books.filter((b) => {
      const natFormatted = formatNationality(b.originalNationality);
      if (filter.category && b.category !== filter.category) return false;
      if (b.rating < filter.minRating) return false;
      if (filter.nationality && natFormatted !== filter.nationality && b.originalNationality !== filter.nationality) return false;
      if (q) {
        const matchTitle = normalize(b.title).includes(q);
        const matchAuthor = normalize(b.author).includes(q);
        const matchNationality = normalize(b.originalNationality).includes(q) || normalize(natFormatted).includes(q);
        const matchCategory = normalize(b.category).includes(q);
        if (!matchTitle && !matchAuthor && !matchNationality && !matchCategory) return false;
      }
      return true;
    });
    const sorters: Record<FilterState['sort'], (a: Book, b: Book) => number> = {
      score_desc: (a, b) => b.rating - a.rating,
      recent: (a, b) => b.syncDate.localeCompare(a.syncDate),
      year: (a, b) => b.releaseYear - a.releaseYear,
      alpha: (a, b) => a.title.localeCompare(b.title, 'pt-BR'),
    };
    return list.sort(sorters[filter.sort]);
  }, [books, filter, searchQuery]);

  const openNew = () => {
    setEditing(null);
    setBookModal(true);
  };
  const openEdit = (b: Book) => {
    setEditing(b);
    setBookModal(true);
  };
  const doExport = () => exportJson(books, categories);

  const catalog = (
    <>
      <TelemetryStrip
        books={books}
        categories={categories}
        selectedCategory={filter.category}
        visibleCount={filteredBooks.length}
      />
      <FilterBar
        books={books}
        categories={categories}
        filter={filter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onChange={patchFilter}
        onNewCategory={() => setCatModal(true)}
        onDeleteCategory={setDeleteCat}
        onExport={doExport}
        visible={filteredBooks.length}
      />
      <section className="p-4 lg:p-gutter-desktop grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg">
        {filteredBooks.map((b) => (
          <BookCard
            key={b.id}
            book={b}
            categories={categories}
            onOpenCritique={setCritiqueBook}
            onEdit={openEdit}
            onDelete={deleteBook}
          />
        ))}
        {filteredBooks.length === 0 && (
          <div className="col-span-full border border-dashed border-outline-variant bg-surface-container-low/40 p-10 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-primary-container text-[32px]">search_off</span>
            <p className="text-on-surface font-label-md text-label-md tracking-wider">
              NENHUM REGISTRO ENCONTRADO PARA A BUSCA ATUAL
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-primary-container text-surface-container-lowest font-label-sm text-label-sm font-bold hover:bg-primary-fixed-dim transition-colors neon-glow-cyan"
            >
              [ LIMPAR FILTROS ]
            </button>
          </div>
        )}
      </section>
    </>
  );

  const categoriesView = (
    <section id="categorias" className="p-4 lg:p-gutter-desktop space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm">CATEGORIAS</h2>
        <button
          onClick={() => setCatModal(true)}
          className="px-3 py-1.5 bg-primary-container text-background font-label-sm text-label-sm font-bold neon-glow-cyan"
        >
          [ + NOVA CATEGORIA ]
        </button>
      </div>
      {categories.map((c) => {
        const n = books.filter((b) => b.category === c.name).length;
        return (
          <div
            key={c.id}
            className="w-full flex items-stretch border bg-surface-container-low"
            style={{ borderColor: `${c.color}66` }}
          >
            <button
              onClick={() => {
                patchFilter({ category: c.name });
                setView('catalog');
              }}
              className="flex-1 min-w-0 flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-3 h-3 shrink-0" style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                <span className="font-title-md uppercase truncate" style={{ color: c.color }}>
                  {c.name}
                </span>
                <span className="text-code-dense text-outline hidden sm:inline">ID_ARQUIVO // ####-{c.suffix}</span>
              </span>
              <span className="font-label-md shrink-0" style={{ color: c.color }}>
                {String(n).padStart(2, '0')} VOL
              </span>
            </button>
            {c.id !== DEFAULT_CATEGORY.id && (
              <button
                onClick={() => setDeleteCat(c)}
                title="Excluir categoria"
                aria-label={`Excluir categoria ${c.name}`}
                className="px-3 border-l text-outline hover:text-[#ff007f] hover:bg-[#ff007f]/10"
                style={{ borderColor: `${c.color}66` }}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            )}
          </div>
        );
      })}
    </section>
  );

  const profileView = (
    <>
      <TelemetryStrip
        books={books}
        categories={categories}
        selectedCategory={filter.category}
        visibleCount={filteredBooks.length}
      />
      <section className="p-4 lg:p-gutter-desktop space-y-3">
        <div className="border border-outline-variant bg-surface-container-low p-4">
          <div className="text-code-dense text-outline">ID_SIS: #0842 · ACESSO: NÍVEL_5</div>
          <div className="font-headline-sm text-headline-sm mt-1">OPERADOR_0842</div>
          <div className="text-body-sm text-on-surface-variant mt-1">
            Persistência: {sync === 'CLOUD' ? 'Firebase Firestore (Nuvem)' : 'Banco Local Criptografado (Offline-First)'}
          </div>
        </div>
        <button
          onClick={doExport}
          className="w-full bg-surface-container border border-outline-variant hover:border-primary-container py-2 font-label-sm text-label-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px] text-primary-container">file_download</span>
          [ SALVAR PACOTE DE DADOS ] EXPORTAR JSON
        </button>
        <button onClick={purge} className="w-full border border-error/50 text-error py-2 font-label-sm text-label-sm">
          LIMPAR DADOS LOCAIS
        </button>
      </section>
    </>
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-surface-container-lowest">
      <div className="scanlines fixed inset-0 z-50" />
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchRef={searchRef}
        view={view}
        onView={setView}
        onNewBook={openNew}
      />
      <div className="flex pt-14 flex-1">
        <Sidebar
          books={books}
          categories={categories}
          selected={filter.category}
          onSelect={(c) => {
            patchFilter({ category: c });
            setView('catalog');
          }}
          onNewCategory={() => setCatModal(true)}
          onDeleteCategory={setDeleteCat}
          onExport={doExport}
          onPurge={purge}
          onHistory={() => setView('profile')}
        />
        <main className="lg:ml-64 flex-1 flex flex-col min-w-0 bg-surface-container-lowest pb-24 lg:pb-12">
          {view === 'catalog' && catalog}
          {view === 'ranking' && <RankingView books={books} categories={categories} onOpen={setCritiqueBook} />}
          {view === 'categories' && categoriesView}
          {view === 'profile' && profileView}
          <Footer total={books.length} sync={sync} />
        </main>
      </div>
      <BottomNav view={view} onView={setView} />

      <NewBookModal
        open={bookModal}
        onClose={() => setBookModal(false)}
        categories={categories}
        books={books}
        editing={editing}
        onSave={saveBook}
      />
      <NewCategoryModal open={catModal} onClose={() => setCatModal(false)} existing={categories} onCreate={createCategory} />
      <CritiqueModal book={critiqueBook} categories={categories} onClose={() => setCritiqueBook(null)} onEdit={openEdit} />
      <ConfirmCategoryDelete
        category={deleteCat}
        affected={deleteCat ? books.filter((b) => b.category === deleteCat.name).length : 0}
        onCancel={() => setDeleteCat(null)}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
}
