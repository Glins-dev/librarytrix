import type { Book, Category } from './types';

export const CYAN = '#00f0ff';

export function colorOf(categories: Category[], name: string): string {
  return categories.find((c) => c.name === name)?.color ?? CYAN;
}

export function suffixOf(categories: Category[], name: string): string {
  return categories.find((c) => c.name === name)?.suffix ?? 'GEN';
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}.${m}.${y}`;
}

export const normalize = (str: string) =>
  str
    ? str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    : '';

export function formatArchiveId(id: string): string {
  return id.replace('ARCHIVE_ID // ', 'ID_ARQUIVO // ');
}

export function formatNationality(nat: string): string {
  const u = (nat ?? '').trim().toUpperCase();
  if (u === 'UK') return 'REINO UNIDO';
  return u;
}

/** Cor do contador de caracteres: neutro → amarelo (>900) → magenta (=1000). */
export function counterColor(len: number): string {
  if (len >= 1000) return '#ff007f';
  if (len > 900) return '#ffb800';
  return '#849495';
}

/** Valida e normaliza hex (#RGB ou #RRGGBB) para #RRGGBB maiúsculo; null se inválido. */
export function normalizeHex(input: string): string | null {
  const v = input.trim();
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(v)) return null;
  const h = v.slice(1);
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return `#${full.toUpperCase()}`;
}

export function glowClass(color: string): string {
  switch (color.toLowerCase()) {
    case '#39ff14':
      return 'text-phosphor-green';
    case '#00f0ff':
      return 'text-phosphor-cyan';
    case '#ff007f':
      return 'text-phosphor-magenta';
    case '#a855f7':
      return 'text-phosphor-violet';
    case '#ffb800':
      return 'text-phosphor-amber';
    default:
      return '';
  }
}

function archiveSeq(id: string): number {
  const m = /\/\/ (\d+)-/.exec(id);
  return m ? parseInt(m[1], 10) : 0;
}

export function stats(books: Book[], categories: Category[]) {
  const total = books.length;
  const rated = books.filter((b) => b.rating > 0);
  const avg = rated.length ? rated.reduce((s, b) => s + b.rating, 0) / rated.length : 0;
  const criticados = books.filter((b) => b.status === 'CRITICADO').length;
  const pendentes = books.filter((b) => b.status === 'PENDENTE').length;
  const pct = total ? Math.round((criticados / total) * 100) : 0;
  const counts = categories
    .map((c) => ({ cat: c, n: books.filter((b) => b.category === c.name).length }))
    .sort((a, b) => b.n - a.n);
  const dominant = counts[0];
  const second = counts[1];
  const latestBook =
    books.length > 0
      ? [...books].sort(
          (a, b) => b.syncDate.localeCompare(a.syncDate) || archiveSeq(b.id) - archiveSeq(a.id),
        )[0]
      : null;
  return {
    total,
    avg,
    criticados,
    pendentes,
    pct,
    dominant,
    second,
    dominantPct: total && dominant ? Math.round((dominant.n / total) * 100) : 0,
    latestBook,
  };
}

