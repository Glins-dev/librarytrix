import { useState } from 'react';
import Modal from './Modal';
import { DEFAULT_CATEGORY, type Category } from '../types';
import { normalizeHex } from '../utils';

interface Props {
  open: boolean;
  onClose: () => void;
  existing: Category[];
  onCreate: (c: Category) => void;
}

const PRESETS = [
  { color: '#39FF14', suffix: 'CYB' },
  { color: '#00F0FF', suffix: 'SCI' },
  { color: '#A855F7', suffix: 'FIL' },
  { color: '#FF007F', suffix: 'DIS' },
  { color: '#FFB800', suffix: 'HIS' },
];

const HEX_RE = /^#([0-9A-F]{3}){1,2}$/i;

export default function NewCategoryModal({ open, onClose, existing, onCreate }: Props) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#00F0FF');
  const [suffix, setSuffix] = useState('');
  const [error, setError] = useState('');

  const normalized = normalizeHex(hex);
  const previewColor = normalized ?? '#849495';

  const reset = () => {
    setName('');
    setSuffix('');
    setError('');
    setHex('#00F0FF');
  };
  const close = () => {
    reset();
    onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const s = suffix.trim().toUpperCase();
    if (!n) return setError('ERRO: nome obrigatório.');
    if (n.toLowerCase() === DEFAULT_CATEGORY.name.toLowerCase() || existing.some((c) => c.name.toLowerCase() === n.toLowerCase()))
      return setError('ERRO: categoria já existe.');
    if (!HEX_RE.test(hex.trim()) || !normalized) return setError('ERRO: cor hexadecimal inválida (ex.: #00F0FF).');
    if (!/^[A-Z]{2,4}$/.test(s)) return setError('ERRO: sufixo deve ter 2 a 4 letras (ex.: BIO).');
    onCreate({
      id: n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
      name: n,
      color: normalized,
      suffix: s,
    });
    close();
  };

  return (
    <Modal open={open} onClose={close}>
      <form onSubmit={submit}>
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary-container text-[18px]">add_circle</span>
            <span className="font-headline-sm text-headline-sm font-bold text-primary">CRIAR CATEGORIA</span>
          </div>
          <button type="button" onClick={close} className="text-outline hover:text-secondary font-label-sm text-label-sm font-bold">
            [ FECHAR_X ]
          </button>
        </div>

        <div className="py-4 space-y-4 text-body-sm">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
              NOME DA CATEGORIA &gt;
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Biopunk, Horror Cósmico..."
              className="w-full bg-surface-container border border-outline text-on-surface px-3 py-2 font-label-sm text-label-sm focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
              SELETOR DE COR NEON PHOSPHOR:
            </label>
            <div className="grid grid-cols-5 gap-2 pt-1">
              {PRESETS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => {
                    setHex(c.color);
                    if (!suffix) setSuffix(c.suffix);
                  }}
                  className="h-8 flex items-center justify-center text-[10px] font-bold"
                  style={{
                    color: c.color,
                    background: `${c.color}33`,
                    border: `${previewColor === c.color ? 2 : 1}px solid ${c.color}`,
                    boxShadow: previewColor === c.color ? `0 0 8px ${c.color}` : undefined,
                  }}
                >
                  {c.suffix}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
              CÓDIGO HEXADECIMAL CUSTOMIZADO:
            </label>
            <div className="flex items-stretch gap-2">
              <input
                type="color"
                aria-label="Seletor visual de cor"
                value={previewColor}
                onChange={(e) => setHex(e.target.value.toUpperCase())}
                className="h-9 w-12 p-0 bg-surface-container border border-outline cursor-pointer"
              />
              <input
                value={hex}
                maxLength={7}
                onChange={(e) => setHex(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
                placeholder="#00F0FF"
                spellCheck={false}
                className="flex-1 bg-surface-container border px-3 py-2 font-label-sm text-label-sm uppercase focus:outline-none"
                style={{ borderColor: normalized ? previewColor : '#ff007f', color: normalized ? previewColor : '#ff007f' }}
              />
            </div>
            {!normalized && <div className="text-[#ff007f] font-label-sm text-label-sm mt-1">FORMATO: #RGB ou #RRGGBB</div>}
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
              PRÉ-VISUALIZAÇÃO DA ETIQUETA:
            </label>
            <span
              className="inline-block px-1.5 py-0.5 border text-label-sm font-label-sm uppercase font-bold"
              style={{ color: previewColor, borderColor: previewColor, backgroundColor: `${previewColor}1A` }}
            >
              {name.trim() || 'NOVA CATEGORIA'}
            </span>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
              PREFIXO DE PROTOCOLO // IDENTIFICADOR:
            </label>
            <div className="flex">
              <span className="bg-surface-container border border-r-0 border-outline text-outline px-3 py-1.5 font-label-sm text-label-sm whitespace-nowrap">
                ID_ARQUIVO // 0000-
              </span>
              <input
                value={suffix}
                maxLength={4}
                onChange={(e) => setSuffix(e.target.value.toUpperCase())}
                placeholder="BIO"
                className="w-full bg-surface-container border border-outline text-on-surface px-3 py-1.5 font-label-sm text-label-sm focus:border-primary-container focus:outline-none"
              />
            </div>
          </div>
          {error && <div className="text-[#ff007f] font-label-sm text-label-sm">{error}</div>}
        </div>

        <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
          <button type="button" onClick={close} className="px-3 py-1.5 bg-surface-container text-on-surface font-label-sm text-label-sm hover:text-white">
            CANCELAR
          </button>
          <button type="submit" className="px-4 py-1.5 bg-primary-container text-background font-label-sm text-label-sm font-bold neon-glow-cyan active:scale-95">
            [ REGISTRAR NO BANCO ]
          </button>
        </div>
      </form>
    </Modal>
  );
}
