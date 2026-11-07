import Modal from './Modal';
import { CharCounter } from './CritiqueEditor';
import type { Book, Category } from '../types';
import { colorOf, formatDate, formatNationality } from '../utils';

interface Props {
  book: Book | null;
  categories: Category[];
  onClose: () => void;
  onEdit?: (b: Book) => void;
}

export default function CritiqueModal({ book, categories, onClose, onEdit }: Props) {
  if (!book) return <Modal open={false} onClose={onClose}>{null}</Modal>;
  const color = colorOf(categories, book.category);
  const text = book.critique ?? '';
  const nationality = formatNationality(book.originalNationality);

  return (
    <Modal open onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant gap-2">
        <span className="font-label-md text-label-md text-primary-container">
          TERMINAL DE CRÍTICA V4.0 // LIMITE: 1000 CARACTERES
        </span>
        <button onClick={onClose} className="text-outline hover:text-secondary font-label-sm text-label-sm font-bold whitespace-nowrap">
          [ FECHAR_X ]
        </button>
      </div>
      <div className="py-3 flex items-start justify-between gap-2">
        <div>
          <div className="font-headline-sm text-headline-sm font-bold" style={{ color }}>
            {book.title}
          </div>
          <div className="text-body-sm text-on-surface-variant">
            {book.author} · {nationality} // {book.releaseYear}
          </div>
        </div>
        <span
          className="px-2 py-0.5 border text-label-sm font-label-sm uppercase font-bold shrink-0"
          style={{ color, borderColor: color, background: `${color}1a` }}
        >
          {book.category} · {book.rating.toFixed(1)} ★
        </span>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant p-4 font-mono text-body-md text-on-surface whitespace-pre-wrap min-h-[220px] max-h-[380px] overflow-y-auto">
        {text || <span className="text-outline italic">— nenhuma crítica registrada para este volume —</span>}
      </div>
      <div className="pt-3 mt-3 border-t border-outline-variant flex items-center justify-between flex-wrap gap-2 text-label-sm font-label-sm">
        <div className="flex items-center gap-3">
          <CharCounter length={text.length} />
          <span className="text-outline">REGISTRADO EM: {formatDate(book.syncDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => {
                const target = book;
                onClose();
                onEdit(target);
              }}
              className="px-3 py-1.5 bg-surface-container border border-outline-variant hover:border-primary-container text-on-surface font-bold"
            >
              [ EDITAR NO REGISTRO ]
            </button>
          )}
          <button onClick={onClose} className="px-4 py-1.5 bg-primary-container text-background font-bold neon-glow-cyan">
            [ FECHAR_X ]
          </button>
        </div>
      </div>
    </Modal>
  );
}
