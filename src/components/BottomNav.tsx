import type { ViewKey } from '../types';

interface Props {
  view: ViewKey;
  onView: (v: ViewKey) => void;
}

const ITEMS: { key: ViewKey; label: string; icon: string }[] = [
  { key: 'catalog', label: 'Catálogo', icon: 'menu_book' },
  { key: 'categories', label: 'Categorias', icon: 'category' },
  { key: 'ranking', label: 'Ranking', icon: 'leaderboard' },
  { key: 'profile', label: 'Perfil', icon: 'person' },
];

export default function BottomNav({ view, onView }: Props) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-1 bg-surface-dim border-t border-outline-variant shadow-2xl">
      {ITEMS.map((i) => {
        const active = view === i.key;
        return (
          <button
            key={i.key}
            onClick={() => onView(i.key)}
            className={`flex flex-col items-center justify-center font-label-sm text-label-sm pt-1 pb-1 flex-1 active:scale-95 transition-transform border-t-2 ${
              active
                ? 'text-primary-container font-bold border-primary-container'
                : 'text-on-surface-variant border-transparent hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{i.icon}</span>
            <span className="tracking-wider mt-0.5">{i.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

