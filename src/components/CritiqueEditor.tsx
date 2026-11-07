import { MAX_CRITIQUE_CHARS } from '../types';
import { counterColor } from '../utils';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  height?: number;
  placeholder?: string;
  autoFocus?: boolean;
}

/** Contador em tempo real `CARACTERES: XXX / 1000` (amarelo > 900, magenta = 1000). */
export function CharCounter({ length }: { length: number }) {
  return (
    <span className="font-label-sm text-label-sm font-bold" style={{ color: counterColor(length) }}>
      CARACTERES: {String(length).padStart(3, '0')} / {MAX_CRITIQUE_CHARS}
    </span>
  );
}

/** Editor de crítica com limite estrito de 1000 caracteres. */
export default function CritiqueEditor({
  value,
  onChange,
  onSubmit,
  height = 320,
  placeholder = 'CRÍTICA > Digite a crítica do livro (máx. 1000 caracteres)...',
  autoFocus,
}: Props) {
  return (
    <div className="flex flex-col bg-surface-container-lowest border border-outline-variant font-mono" style={{ height }}>
      <textarea
        value={value}
        autoFocus={autoFocus}
        maxLength={MAX_CRITIQUE_CHARS}
        placeholder={placeholder}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CRITIQUE_CHARS) onChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onSubmit?.();
          }
        }}
        className="critique-area flex-1 w-full bg-transparent border-0 p-3 text-on-surface focus:outline-none focus:ring-0 placeholder:text-outline/50 font-mono"
        style={{ overflowY: 'auto' }}
        spellCheck={false}
      />
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-outline-variant bg-surface-container">
        <span className="text-code-dense font-code-dense text-outline">
          <span className="text-primary-container">REGISTRO &gt;</span> BUFFER ATIVO
        </span>
        <CharCounter length={value.length} />
      </div>
    </div>
  );
}
