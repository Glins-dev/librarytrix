import { getOperatorInitials, getOperatorNodeId } from '../services/authService';
import { DEFAULT_CATEGORY, type Book, type Category, type OperatorUser } from '../types';

interface Props {
  user: OperatorUser;
  onLogout: () => void;
  books: Book[];
  categories: Category[];
  selected: string | null;
  onSelect: (name: string | null) => void;
  onNewCategory: () => void;
  onDeleteCategory: (c: Category) => void;
  onExport: () => void;
  onPurge: () => void;
  onHistory: () => void;
}

const ICONS: Record<string, string> = {
  Cyberpunk: 'terminal',
  'Ficção Científica': 'rocket_launch',
  Distopia: 'warning',
  Filosofia: 'psychology',
  História: 'auto_stories',
};

export default function Sidebar({
  user,
  onLogout,
  books,
  categories,
  selected,
  onSelect,
  onNewCategory,
  onDeleteCategory,
  onExport,
  onPurge,
  onHistory,
}: Props) {
  const initials = getOperatorInitials(user.displayName);
  const nodeId = getOperatorNodeId(user.uid);

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-outline-variant bg-surface-container-low p-space-sm fixed left-0 top-14 bottom-7 z-30 overflow-y-auto">
      <div className="flex flex-col gap-space-sm">
        <div className="p-3 bg-surface-container-lowest border border-outline-variant mb-2">
          <div className="flex items-center justify-between text-code-dense font-code-dense text-outline mb-1.5">
            <span>ID_SIS: {nodeId}</span>
            <span className="text-[#39ff14]">CRIPTOGRAFADO</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-surface-container-high border border-primary-container/50 flex items-center justify-center text-primary-container text-label-md font-label-md font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-title-md font-title-md text-on-surface uppercase truncate" title={user.displayName}>
                {user.displayName}
              </div>
              <div className="text-code-dense font-code-dense text-outline truncate" title={user.email}>
                {user.email}
              </div>
            </div>
          </div>
          <div className="text-label-sm font-label-sm text-primary-container mt-2">ACESSO: NÍVEL_5 // ISOLADO</div>
          <div className="mt-1.5 w-full bg-surface-container-high h-1">
            <div className="bg-primary-container h-1 w-3/4" />
          </div>
        </div>

        <button
          onClick={onNewCategory}
          className="w-full bg-primary-container/10 border border-primary-container text-primary-container hover:bg-primary-container hover:text-surface-container-lowest px-3 py-2 text-label-sm font-label-sm font-bold flex items-center justify-between transition-all duration-150 hud-glow-cyan mb-2"
        >
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">create_new_folder</span>+ NOVA CATEGORIA
          </span>
          <span className="text-code-dense font-code-dense border border-current px-1 select-none">ALT+N</span>
        </button>

        <div className="px-2 pt-2 text-code-dense font-code-dense text-outline uppercase tracking-wider flex items-center justify-between">
          <span>CLASSIFICAÇÃO DE DADOS</span>
          <span>({String(categories.length).padStart(2, '0')})</span>
        </div>

        <nav className="flex flex-col gap-1 mt-1">
          <button
            onClick={() => onSelect(null)}
            className={`border-l-2 font-label-sm px-3 py-2 flex items-center justify-between transition-colors duration-150 text-left ${
              selected === null
                ? 'border-primary-container bg-surface-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">folder_open</span>
              <span>TODOS OS ARQUIVOS</span>
            </div>
            <span className="text-code-dense font-code-dense bg-primary-container/20 px-1.5 py-0.5 text-primary-container border border-primary-container/40">
              {books.length}
            </span>
          </button>
          {categories.map((c) => {
            const n = books.filter((b) => b.category === c.name).length;
            const active = selected === c.name;
            return (
              <div
                key={c.id}
                className="group/cat border-l-2 flex items-center hover:bg-surface-container-high transition-colors duration-150"
                style={{
                  borderColor: active ? c.color : 'transparent',
                  background: active ? `${c.color}14` : undefined,
                  color: active ? c.color : undefined,
                }}
              >
                <button
                  onClick={() => onSelect(active ? null : c.name)}
                  className="flex-1 min-w-0 font-label-sm px-3 py-2 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: c.color }}>
                      {ICONS[c.name] ?? 'label'}
                    </span>
                    <span className="uppercase truncate">{c.name}</span>
                  </div>
                  <span
                    className="text-code-dense font-code-dense px-1.5 py-0.5 border"
                    style={{ color: c.color, background: `${c.color}1a`, borderColor: `${c.color}4d` }}
                  >
                    {n}
                  </span>
                </button>
                {c.id !== DEFAULT_CATEGORY.id && (
                  <button
                    onClick={() => onDeleteCategory(c)}
                    title="Excluir categoria"
                    aria-label={`Excluir categoria ${c.name}`}
                    className="px-2 py-2 text-outline hover:text-[#ff007f]"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-outline-variant pt-space-sm flex flex-col gap-1">
        <button
          onClick={onExport}
          className="w-full bg-surface-container hover:bg-surface-container-highest border border-outline-variant text-on-surface text-label-sm font-label-sm py-2 px-3 flex items-center justify-center gap-2 transition-colors mb-1"
        >
          <span className="material-symbols-outlined text-[16px] text-primary-container">file_download</span>
          [ SALVAR PACOTE DE DADOS ]
        </button>
        <button
          onClick={onHistory}
          className="border-l-2 border-transparent text-on-surface-variant font-label-sm px-3 py-1.5 flex items-center gap-2 hover:bg-surface-container-high hover:text-on-surface text-left"
        >
          <span className="material-symbols-outlined text-[16px]">history</span>
          HISTÓRICO DE SINCRONIA
        </button>
        <button
          onClick={onPurge}
          className="border-l-2 border-transparent text-error font-label-sm px-3 py-1.5 flex items-center gap-2 hover:bg-surface-container-high text-left"
        >
          <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
          LIMPAR DADOS LOCAIS
        </button>
        <button
          onClick={onLogout}
          className="mt-1 w-full bg-[#ff007f]/10 hover:bg-[#ff007f] text-[#ff007f] hover:text-surface-container-lowest border border-[#ff007f]/60 font-label-sm text-label-sm font-bold py-2 px-3 flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          [ ENCERRAR SESSÃO ]
        </button>
      </div>
    </aside>
  );
}
