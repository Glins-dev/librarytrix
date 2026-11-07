import type { Book, Category } from '../types';
import { colorOf, formatArchiveId, formatDate, formatNationality, glowClass } from '../utils';
import RatingBar from './RatingBar';

interface Props {
  book: Book;
  categories: Category[];
  onOpenCritique: (b: Book) => void;
  onEdit: (b: Book) => void;
  onDelete: (b: Book) => void;
}

export default function BookCard({ book, categories, onOpenCritique, onEdit, onDelete }: Props) {
  const color = colorOf(categories, book.category);
  const fullId = formatArchiveId(book.id);
  const idShort = fullId.replace('ID_ARQUIVO // ', '#');
  const nationality = formatNationality(book.originalNationality);

  return (
    <article
      className="bg-surface-container-low border border-outline-variant transition-all duration-200 flex flex-col group relative"
      style={{ ['--accent' as string]: color }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="px-4 py-2 border-b border-outline-variant bg-surface-container flex items-center justify-between text-code-dense font-code-dense gap-2">
        <span className="text-outline truncate">
          <span className="hidden lg:inline">{fullId}</span>
          <span className="lg:hidden" style={{ color }}>
            {idShort}
          </span>
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="px-1.5 py-0.5 border text-label-sm font-label-sm uppercase font-bold"
            style={{ color, borderColor: color, background: `${color}1a` }}
          >
            {book.category}
          </span>
          <span className="text-on-surface-variant hidden sm:inline">
            {nationality} // {book.releaseYear}
          </span>
        </div>
      </div>

      <div className="p-4 flex gap-4">
        <div className="w-24 h-36 flex-shrink-0 bg-surface-container-high border border-outline-variant relative overflow-hidden">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={`Capa de ${book.title}`} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center text-center p-1.5 gap-1"
              style={{ background: `linear-gradient(160deg, ${color}33, #0e0e12 70%)` }}
            >
              <span className="material-symbols-outlined" style={{ color }}>
                menu_book
              </span>
              <span className="text-[9px] font-label-sm uppercase leading-tight text-on-surface-variant line-clamp-3">
                {book.title}
              </span>
            </div>
          )}
          <div
            className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest/90 px-1 text-[9px] font-mono text-center"
            style={{ color }}
          >
            {book.releaseYear} [{nationality}]
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-headline-sm text-headline-sm font-bold leading-tight text-on-surface truncate">
                {book.title}
              </h3>
              <span className={`font-title-md text-title-md font-bold shrink-0 ${glowClass(color)}`} style={{ color }}>
                {book.rating.toFixed(1)} ★
              </span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant truncate">{book.author}</p>
            <div className="flex items-center gap-2 mt-2 text-code-dense font-code-dense">
              <span className="text-outline">STATUS:</span>
              <span style={{ color }}>{book.status}</span>
            </div>
            {book.telemetryTag && (
              <div className="text-label-sm font-label-sm text-outline mt-1 truncate">
                CLASSIFICAÇÃO: {book.telemetryTag}
              </div>
            )}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-code-dense font-code-dense mb-1">
              <span className="text-outline">AVALIAÇÃO HUD</span>
              <span style={{ color }} className="font-bold">
                {book.rating.toFixed(1)} / 5.0
              </span>
            </div>
            <RatingBar rating={book.rating} color={color} />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-outline-variant bg-surface-container-lowest/60 flex-1">
        <div className="text-code-dense font-code-dense mb-1 flex items-center gap-1" style={{ color }}>
          <span className="material-symbols-outlined text-[14px]">terminal</span>
          <span>CRÍTICA &gt;</span>
        </div>
        <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 italic font-mono">
          {book.critique ? `"${book.critique.replace(/\n/g, ' ')}"` : '— sem crítica registrada —'}
        </p>
      </div>

      <div className="px-4 py-2 border-t border-outline-variant bg-surface-container flex items-center justify-between text-label-sm font-label-sm gap-2">
        <span className="text-code-dense font-code-dense text-outline">REGISTRADO EM: {formatDate(book.syncDate)}</span>
        <div className="flex items-center gap-3">
          <button onClick={() => onEdit(book)} className="text-outline hover:text-primary-container" title="Editar">
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button onClick={() => onDelete(book)} className="text-outline hover:text-[#ff007f]" title="Excluir">
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
          <button
            onClick={() => onOpenCritique(book)}
            className="hover:underline flex items-center gap-1 font-bold"
            style={{ color }}
          >
            [ VER CRÍTICA COMPLETA ]
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
}
