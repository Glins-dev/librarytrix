import Modal from './Modal';
import type { Category } from '../types';

interface Props {
  category: Category | null;
  affected: number;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirmação estilo terminal para exclusão de categoria. */
export default function ConfirmCategoryDelete({ category, affected, onCancel, onConfirm }: Props) {
  if (!category) return <Modal open={false} onClose={onCancel}>{null}</Modal>;
  return (
    <Modal open onClose={onCancel}>
      <div className="font-label-md text-label-md text-[#ff007f] pb-3 border-b border-outline-variant">
        CONFIRMAR EXCLUSÃO // Deseja remover esta categoria?
      </div>
      <div className="py-4 space-y-3 text-body-sm">
        <span
          className="inline-block px-1.5 py-0.5 border text-label-sm font-label-sm uppercase font-bold"
          style={{ color: category.color, borderColor: category.color, backgroundColor: `${category.color}1A` }}
        >
          {category.name}
        </span>
        <p className="text-on-surface-variant">
          {affected > 0
            ? `${affected} livro(s) vinculado(s) serão reatribuídos automaticamente para a categoria GERAL (#849495).`
            : 'Nenhum livro vinculado a esta categoria.'}
        </p>
      </div>
      <div className="pt-3 border-t border-outline-variant flex justify-end gap-2">
        <button onClick={onCancel} autoFocus className="px-3 py-1.5 bg-surface-container text-on-surface font-label-sm text-label-sm">
          [ CANCELAR ]
        </button>
        <button onClick={onConfirm} className="px-4 py-1.5 bg-[#ff007f] text-background font-label-sm text-label-sm font-bold">
          [ CONFIRMAR_EXCLUSÃO ]
        </button>
      </div>
    </Modal>
  );
}

