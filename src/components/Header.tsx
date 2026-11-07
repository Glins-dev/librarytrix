import { getOperatorInitials, getOperatorNodeId } from '../services/authService';
import type { Category, OperatorUser, ViewKey } from '../types';

interface Props {
  user: OperatorUser;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  view: ViewKey;
  onView: (v: ViewKey) => void;
  onNewBook: () => void;
  categories?: Category[];
}

const NAV: { key: ViewKey; label: string }[] = [
  { key: 'catalog', label: 'CATÁLOGO' },
  { key: 'ranking', label: 'RANKING' },
  { key: 'profile', label: 'MÉTRICAS' },
];

export default function Header({
  user,
  onLogout,
  searchQuery,
  onSearchChange,
  searchRef,
  view,
  onView,
  onNewBook,
}: Props) {
  const initials = getOperatorInitials(user.displayName);
  const nodeId = getOperatorNodeId(user.uid);

  return (
    <header className="flex justify-between items-center w-full px-4 lg:px-gutter-desktop h-14 bg-surface-container-lowest border-b border-outline-variant fixed top-0 z-40 left-0 right-0 gap-3">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-primary-container lg:hidden">terminal</span>
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
            <span className="text-title-md font-title-md tracking-wider text-primary-container leading-none">
              LIBRARYTRIX // DB-01
            </span>
            <span className="hidden lg:inline px-1.5 py-0.5 bg-primary-container/10 border border-primary-container/40 text-primary-container text-label-sm font-label-sm">
              SISTEMA_ARQUIVO
            </span>
            <span className="lg:hidden text-label-sm font-label-sm text-outline tracking-widest mt-0.5 truncate max-w-[180px]">
              {user.displayName.toUpperCase()} • NÓ {nodeId}
            </span>
          </div>
        </div>
        <div className="relative hidden md:flex items-center bg-surface-container-low border border-outline-variant px-3 py-1.5 focus-within:border-primary-container focus-within:hud-glow-cyan w-64 lg:w-96">
          <span className="text-label-sm font-label-sm text-outline mr-2 select-none whitespace-nowrap">BUSCAR &gt;</span>
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (view !== 'catalog') onView('catalog');
            }}
            className="bg-transparent border-none p-0 text-body-sm font-body-sm text-on-surface focus:ring-0 w-full placeholder:text-outline/60 focus:outline-none"
            placeholder="Buscar por título, autor, nacionalidade ou categoria..."
            type="text"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                searchRef.current?.focus();
              }}
              title="Limpar busca"
              aria-label="Limpar busca"
              className="text-code-dense font-code-dense text-[#ff007f] hover:bg-[#ff007f] hover:text-background px-1.5 py-0.5 border border-[#ff007f]/60 ml-2 whitespace-nowrap font-bold transition-colors"
            >
              [ X ]
            </button>
          )}
          <span className="text-code-dense font-code-dense text-outline bg-surface-container px-1.5 py-0.5 border border-outline-variant select-none ml-2 whitespace-nowrap">
            CTRL+K
          </span>
        </div>
      </div>

      <nav className="hidden xl:flex items-center gap-6">
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => onView(n.key)}
            className={`font-label-md text-label-md tracking-widest pb-1 transition-colors duration-150 border-b-2 ${
              view === n.key
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {n.label}
          </button>
        ))}
        <button
          onClick={() => onView('profile')}
          className="font-label-md text-label-md tracking-widest pb-1 border-b-2 border-transparent text-on-surface-variant hover:text-primary"
        >
          SISTEMA
        </button>
      </nav>

      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-1.5 text-on-surface-variant hover:text-primary-container"
          aria-label="Pesquisar"
          onClick={() => {
            onView('catalog');
            setTimeout(() => {
              const el = document.getElementById('mobile-search-input') as HTMLInputElement | null;
              el?.focus();
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
          }}
        >
          <span className="material-symbols-outlined">search</span>
        </button>

        {/* Identificação do Operador Autenticado */}
        <div
          className="hidden lg:flex items-center gap-2 px-2 py-1 bg-surface-container border border-outline-variant"
          title={`Logado como ${user.displayName} (${user.email})`}
        >
          <div className="w-6 h-6 bg-surface-container-high border border-primary-container/40 flex items-center justify-center text-primary-container text-label-sm font-label-sm font-bold shrink-0">
            {initials}
          </div>
          <span className="text-label-sm font-label-sm text-on-surface uppercase max-w-[140px] truncate">
            {user.displayName}
          </span>
        </div>

        {/* Botão Encerrar Sessão (Cabeçalho) */}
        <button
          type="button"
          onClick={onLogout}
          title="Encerrar sessão do operador"
          aria-label="Encerrar sessão"
          className="px-2.5 py-1.5 bg-surface-container hover:bg-[#ff007f]/15 border border-outline-variant hover:border-[#ff007f] text-on-surface-variant hover:text-[#ff007f] text-label-sm font-label-sm tracking-wider flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">logout</span>
          <span className="hidden xl:inline">[ ENCERRAR SESSÃO ]</span>
          <span className="xl:hidden hidden sm:inline">SAIR</span>
        </button>

        <button
          onClick={onNewBook}
          className="bg-primary-container text-surface-container-lowest hover:bg-primary-fixed-dim px-3 py-1.5 text-label-md font-label-md tracking-wider flex items-center gap-1 font-bold transition-all duration-150"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span className="hidden sm:inline">[ + NOVO LIVRO ]</span>
          <span className="sm:hidden">NOVO</span>
        </button>
      </div>
    </header>
  );
}
