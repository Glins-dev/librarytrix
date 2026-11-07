import { useEffect, useState } from 'react';
import Modal from './Modal';
import CritiqueEditor from './CritiqueEditor';
import { BOOK_STATUSES, MAX_CRITIQUE_CHARS, type Book, type BookStatus, type Category } from '../types';
import { nextArchiveId } from '../services/storageService';
import { formatArchiveId, formatNationality } from '../utils';

interface Props {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  books: Book[];
  editing: Book | null;
  onSave: (b: Book) => void;
}

type Draft = Omit<Book, 'id' | 'syncDate' | 'releaseYear' | 'rating'> & { releaseYear: string; rating: string };

const empty = (cat: string): Draft => ({
  title: '',
  author: '',
  category: cat,
  releaseYear: String(new Date().getFullYear()),
  originalNationality: '',
  coverUrl: '',
  rating: '0.0',
  status: 'PENDENTE',
  telemetryTag: '',
  critique: '',
});

const field =
  'w-full bg-surface-container border border-outline text-on-surface px-3 py-2 font-label-sm text-label-sm focus:border-primary-container focus:outline-none';
const lbl = 'block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1';

export default function NewBookModal({ open, onClose, categories, books, editing, onSave }: Props) {
  const [d, setD] = useState<Draft>(empty(categories[0]?.name ?? ''));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setD(
      editing
        ? {
            ...editing,
            originalNationality: formatNationality(editing.originalNationality),
            releaseYear: String(editing.releaseYear),
            rating: editing.rating.toFixed(1),
          }
        : empty(categories[0]?.name ?? ''),
    );
  }, [open, editing, categories]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  const submit = () => {
    const rating = parseFloat(d.rating.replace(',', '.'));
    const year = parseInt(d.releaseYear, 10);
    if (!d.title.trim() || !d.author.trim()) return setError('ERRO: título e autor são obrigatórios.');
    if (!d.category) return setError('ERRO: selecione uma categoria.');
    if (Number.isNaN(rating) || rating < 0 || rating > 5) return setError('ERRO: nota deve estar entre 0.0 e 5.0.');
    if (Number.isNaN(year)) return setError('ERRO: ano inválido.');
    if (d.critique.length > MAX_CRITIQUE_CHARS) return setError('ERRO: crítica excede 1000 caracteres.');
    const suffix = categories.find((c) => c.name === d.category)?.suffix ?? 'GEN';
    onSave({
      ...d,
      title: d.title.trim(),
      author: d.author.trim(),
      originalNationality: formatNationality(d.originalNationality || 'BRASIL'),
      rating: Math.round(rating * 10) / 10,
      releaseYear: year,
      id: editing ? formatArchiveId(editing.id) : nextArchiveId(books, suffix),
      syncDate: new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
        <span className="font-headline-sm text-headline-sm font-bold text-primary">
          {editing ? `EDITAR REGISTRO // ${formatArchiveId(editing.id)}` : 'NOVO REGISTRO DE LIVRO'}
        </span>
        <button onClick={onClose} className="text-outline hover:text-secondary font-label-sm text-label-sm font-bold">
          [ FECHAR_X ]
        </button>
      </div>

      <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className={lbl}>TÍTULO &gt;</label>
            <input className={field} value={d.title} onChange={(e) => set('title', e.target.value)} autoFocus />
          </div>
          <div>
            <label className={lbl}>AUTOR &gt;</label>
            <input className={field} value={d.author} onChange={(e) => set('author', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>CATEGORIA</label>
              <select className={field} value={d.category} onChange={(e) => set('category', e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-surface-container-low">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>STATUS</label>
              <select className={field} value={d.status} onChange={(e) => set('status', e.target.value as BookStatus)}>
                {BOOK_STATUSES.map((s) => (
                  <option key={s} className="bg-surface-container-low">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={lbl}>ANO</label>
              <input className={field} inputMode="numeric" value={d.releaseYear} onChange={(e) => set('releaseYear', e.target.value)} />
            </div>
            <div>
              <label className={lbl}>PAÍS</label>
              <input className={field} placeholder="BRASIL, EUA..." value={d.originalNationality} onChange={(e) => set('originalNationality', e.target.value)} />
            </div>
            <div>
              <label className={lbl}>NOTA 0-5</label>
              <input className={field} inputMode="decimal" value={d.rating} onChange={(e) => set('rating', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={lbl}>CAPA (URL)</label>
            <input className={field} placeholder="https://..." value={d.coverUrl} onChange={(e) => set('coverUrl', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>TAG DE TELEMETRIA</label>
            <input className={field} placeholder="MATRIZ // DECKER NEURAL" value={d.telemetryTag} onChange={(e) => set('telemetryTag', e.target.value)} />
          </div>
        </div>

        <div>
          <div className="text-label-sm font-label-sm text-primary-container mb-1">
            TERMINAL DE CRÍTICA V4.0 // LIMITE: 1000 CARACTERES
          </div>
          <CritiqueEditor value={d.critique} onChange={(v) => set('critique', v)} onSubmit={submit} height={420} />
        </div>
      </div>

      {error && <div className="text-[#ff007f] font-label-sm text-label-sm pb-2">{error}</div>}
      <div className="pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
        <span className="text-code-dense font-code-dense text-outline">CTRL+ENTER para submeter</span>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-3 py-1.5 bg-surface-container text-on-surface font-label-sm text-label-sm">
            CANCELAR
          </button>
          <button onClick={submit} className="px-4 py-1.5 bg-primary-container text-background font-label-sm text-label-sm font-bold neon-glow-cyan">
            [ SALVAR CRÍTICA ]
          </button>
        </div>
      </div>
    </Modal>
  );
}
