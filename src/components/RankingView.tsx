import type { Book, Category } from '../types';
import { colorOf } from '../utils';
import RatingBar from './RatingBar';

interface Props {
  books: Book[];
  categories: Category[];
  onOpen: (b: Book) => void;
}

const MEDAL = ['#ffb800', '#00f0ff', '#ff007f'];

export default function RankingView({ books, categories, onOpen }: Props) {
  const ranked = [...books].sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title));

  return (
    <section id="leaderboard" className="p-4 lg:p-gutter-desktop">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">RANKING // CLASSIFICAÇÃO GERAL</h2>
        <span className="text-code-dense font-code-dense text-outline">{ranked.length} VOLUMES</span>
      </div>
      <div className="border border-outline-variant bg-surface-container-low">
        {ranked.map((b, i) => {
          const color = colorOf(categories, b.category);
          const mark = MEDAL[i] ?? '#849495';
          return (
            <button
              key={b.id}
              onClick={() => onOpen(b)}
              className="w-full flex items-center gap-3 px-3 py-3 border-b border-outline-variant/60 last:border-b-0 border-l-[3px] border-l-transparent hover:border-l-primary-container hover:bg-surface-container text-left transition-colors"
            >
              <span className="font-title-md text-title-md w-10 shrink-0" style={{ color: mark }}>
                #{String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-title-md text-body-md text-on-surface truncate">{b.title}</div>
                <div className="text-body-sm text-on-surface-variant truncate">
                  {b.author} ·{' '}
                  <span style={{ color }} className="uppercase">
                    {b.category}
                  </span>
                </div>
              </div>
              <div className="hidden sm:block w-32">
                <RatingBar rating={b.rating} color={color} />
              </div>
              <span className="font-title-md text-title-md w-16 text-right shrink-0" style={{ color }}>
                {b.rating.toFixed(1)} ★
              </span>
            </button>
          );
        })}
        {ranked.length === 0 && <div className="p-6 text-center text-outline">— sem registros —</div>}
      </div>
    </section>
  );
}

