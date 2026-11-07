import { DEFAULT_CATEGORY, type Book, type Category, type FilterState, type MinRating, type SortKey } from '../types';
import { formatNationality } from '../utils';

interface Props {
  books: Book[];
  categories: Category[];
  filter: FilterState;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onChange: (patch: Partial<FilterState>) => void;
  onNewCategory: () => void;
  onDeleteCategory: (c: Category) => void;
  onExport: () => void;
  visible: number;
}

const RATINGS: { label: string; value: MinRating }[] = [
  { label: '[5.0 ★]', value: 5 },
  { label: '[4.5+ ★]', value: 4.5 },
  { label: '[4.0+ ★]', value: 4 },
  { label: '[Todos]', value: 0 },
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'score_desc', label: 'MAIOR NOTA [DESC]' },
  { value: 'recent', label: 'CRÍTICA RECENTE' },
  { value: 'year', label: 'ANO DE PUBLICAÇÃO' },
  { value: 'alpha', label: 'TÍTULO [A-Z]' },
];

export default function FilterBar({
  books,
  categories,
  filter,
  searchQuery,
  onSearchChange,
  onChange,
  onNewCategory,
  onDeleteCategory,
  onExport,
  visible,
}: Props) {
  const nationalities = Array.from(new Set(books.map((b) => formatNationality(b.originalNationality)))).sort();

  return (
    <section className="p-4 lg:p-gutter-desktop border-b border-outline-variant bg-surface-container-low/40 flex flex-col gap-4">
      <div className="hidden lg:flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-headline-sm font-headline-sm text-on-surface tracking-tight">
            CATÁLOGO DE LEITURA &amp; CRÍTICAS
          </span>
          <span className="text-code-dense font-code-dense px-2 py-0.5 bg-surface-container-high text-primary-container border border-outline-variant">
            VISÃO: GRADE COMPACTA ({visible}/{books.length})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNewCategory}
            className="bg-[#00f0ff]/15 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#08080c] border border-[#00f0ff] px-4 py-2 text-label-md font-label-md tracking-wider flex items-center gap-2 font-bold transition-all duration-150 hud-glow-cyan"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>+ NOVA CATEGORIA
          </button>
          <button
            onClick={onExport}
            className="bg-surface-container border border-outline-variant hover:border-primary-container text-on-surface-variant hover:text-on-surface px-3 py-2 text-label-sm font-label-sm flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">file_export</span>EXPORTAR JSON
          </button>
        </div>
      </div>

      {/* Mobile: filtros + categorias */}
      <div className="lg:hidden bg-surface-container-low p-3 border-2 border-primary-container/40 relative">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary-container" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-container" />
        <div className="flex items-center justify-between mb-2.5 gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-[18px]">tune</span>
            <span className="font-label-md text-label-md font-bold tracking-wider uppercase">Filtros &amp; Categorias</span>
            <span className="bg-surface-variant text-primary font-label-sm text-label-sm px-1.5">
              {String(categories.length).padStart(2, '0')} TOTAL
            </span>
          </div>
          <button
            onClick={onNewCategory}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary-container text-background font-label-sm text-label-sm font-bold neon-glow-cyan active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            [ + NOVA CATEGORIA ]
          </button>
        </div>
        <div className="md:hidden mb-2" id="mobile-search">
          <div className="flex items-center bg-surface-container border border-outline-variant px-2 py-1.5 focus-within:border-primary-container">
            <span className="text-label-sm font-label-sm text-outline mr-2 whitespace-nowrap">BUSCAR &gt;</span>
            <input
              id="mobile-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none p-0 text-body-sm w-full focus:outline-none placeholder:text-outline/60"
              placeholder="Buscar por título, autor, nacionalidade ou categoria..."
              type="text"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                title="Limpar busca"
                aria-label="Limpar busca"
                className="text-code-dense font-code-dense text-[#ff007f] hover:bg-[#ff007f] hover:text-background px-1.5 py-0.5 border border-[#ff007f]/60 ml-2 whitespace-nowrap font-bold"
              >
                [ X ]
              </button>
            )}
          </div>
        </div>
        <Chips books={books} categories={categories} filter={filter} onChange={onChange} onDeleteCategory={onDeleteCategory} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 lg:pt-2 lg:border-t border-outline-variant/60">
        <div className="hidden lg:flex">
          <Chips books={books} categories={categories} filter={filter} onChange={onChange} onDeleteCategory={onDeleteCategory} desktop />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-outline-variant bg-surface-container text-code-dense font-code-dense">
            <span className="px-2 py-1 text-outline border-r border-outline-variant">NOTA:</span>
            {RATINGS.map((r, i) => (
              <button
                key={r.value}
                onClick={() => onChange({ minRating: r.value })}
                className={`px-2 py-1 hover:text-primary-container hover:bg-surface-container-high ${
                  i < RATINGS.length - 1 ? 'border-r border-outline-variant' : ''
                } ${
                  filter.minRating === r.value
                    ? 'text-primary-container bg-surface-container-high font-bold'
                    : 'text-on-surface-variant'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-outline-variant bg-surface-container px-2 py-1 text-label-sm font-label-sm">
            <span className="text-outline mr-2">PAÍS:</span>
            <select
              value={filter.nationality ?? ''}
              onChange={(e) => onChange({ nationality: e.target.value || null })}
              className="bg-transparent border-none text-on-surface p-0 pr-5 focus:ring-0 focus:outline-none text-label-sm font-label-sm cursor-pointer"
            >
              <option className="bg-surface-container-low" value="">
                TODOS
              </option>
              {nationalities.map((n) => (
                <option className="bg-surface-container-low" key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center border border-outline-variant bg-surface-container px-2 py-1 text-label-sm font-label-sm">
            <span className="text-outline mr-2">ORDEM:</span>
            <select
              value={filter.sort}
              onChange={(e) => onChange({ sort: e.target.value as SortKey })}
              className="bg-transparent border-none text-on-surface p-0 pr-5 focus:ring-0 focus:outline-none text-label-sm font-label-sm cursor-pointer"
            >
              {SORTS.map((s) => (
                <option className="bg-surface-container-low" key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chips({
  books,
  categories,
  filter,
  onChange,
  onDeleteCategory,
  desktop,
}: Pick<Props, 'books' | 'categories' | 'filter' | 'onChange' | 'onDeleteCategory'> & { desktop?: boolean }) {
  const all = filter.category === null;
  return (
    <div className={`flex items-center gap-2 text-label-sm font-label-sm ${desktop ? 'flex-wrap' : 'overflow-x-auto no-scrollbar py-1'}`}>
      {desktop && <span className="text-code-dense font-code-dense text-outline mr-1">FILTRO_SETOR:</span>}
      <button
        onClick={() => onChange({ category: null })}
        className={`whitespace-nowrap px-2.5 py-1 border font-bold ${
          all ? 'bg-primary-container text-surface-container-lowest border-primary-container' : 'border-outline text-on-surface-variant'
        }`}
      >
        {all ? '[x]' : '[ ]'} TODOS ({books.length})
      </button>
      {categories.map((c) => {
        const n = books.filter((b) => b.category === c.name).length;
        const active = filter.category === c.name;
        return (
          <span key={c.id} className="inline-flex items-stretch whitespace-nowrap">
            <button
              onClick={() => onChange({ category: active ? null : c.name })}
              className="px-2.5 py-1 border uppercase transition-colors"
              style={{
                color: active ? '#0e0e12' : c.color,
                background: active ? c.color : `${c.color}1a`,
                borderColor: active ? c.color : `${c.color}66`,
                fontWeight: active ? 700 : 600,
              }}
            >
              {active ? '[x] ' : ''}
              {c.name} ({String(n).padStart(2, '0')})
            </button>
            {c.id !== DEFAULT_CATEGORY.id && (
              <button
                onClick={() => onDeleteCategory(c)}
                title="Excluir categoria"
                aria-label={`Excluir categoria ${c.name}`}
                className="px-1.5 border border-l-0 hover:bg-[#ff007f] hover:text-background hover:border-[#ff007f] transition-colors"
                style={{ color: c.color, borderColor: `${c.color}66` }}
              >
                [X]
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
