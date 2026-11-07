export type BookStatus = 'CRITICADO' | 'ARQUIVADO' | 'LENDO' | 'PENDENTE';

export const BOOK_STATUSES: BookStatus[] = ['CRITICADO', 'ARQUIVADO', 'LENDO', 'PENDENTE'];

export interface Book {
  /** Formato `ID_ARQUIVO // 0842-CYB` */
  id: string;
  title: string;
  author: string;
  /** Nome da categoria (referência a Category.name) */
  category: string;
  releaseYear: number;
  originalNationality: string;
  coverUrl: string;
  /** 0.0 a 5.0 (aceita decimais) */
  rating: number;
  status: BookStatus;
  telemetryTag: string;
  /** Máximo de 1000 caracteres */
  critique: string;
  /** ISO date string */
  syncDate: string;
}

export interface Category {
  id: string;
  name: string;
  /** Cor Neon Phosphor em hexadecimal */
  color: string;
  /** Sufixo de protocolo (CYB, SCI, FIL, DIS, HIS...) */
  suffix: string;
}

export type SortKey = 'score_desc' | 'recent' | 'year' | 'alpha';
export type MinRating = 0 | 4 | 4.5 | 5;
export type ViewKey = 'catalog' | 'categories' | 'ranking' | 'profile';

export interface FilterState {
  category: string | null;
  minRating: MinRating;
  nationality: string | null;
  search: string;
  sort: SortKey;
}

export type SyncState = 'LOCAL' | 'CLOUD' | 'OFFLINE';

export const MAX_CRITIQUE_CHARS = 1000;

/** Categoria de contingência para livros cuja categoria foi excluída. */
export const DEFAULT_CATEGORY: Category = {
  id: 'geral',
  name: 'GERAL',
  color: '#849495',
  suffix: 'GER',
};

