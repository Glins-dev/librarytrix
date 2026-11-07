import { describe, expect, it } from 'vitest';
import {
  booksKey,
  buildExportPayload,
  calculateTelemetry,
  createCategoryForUser,
  deleteBookForUser,
  loadLocal,
  nextArchiveId,
  persistBooks,
  removeCategory,
  saveBookForUser,
} from '../storageService';
import { DEFAULT_CATEGORY, type Book, type Category } from '../../types';
import { normalize } from '../../utils';

const makeValidBook = (overrides: Partial<Book> = {}): Book => ({
  id: 'ID_ARQUIVO // 0900-CYB',
  title: 'Count Zero',
  author: 'William Gibson',
  category: 'Cyberpunk',
  releaseYear: 1986,
  originalNationality: 'EUA',
  coverUrl: 'https://example.com/count-zero.jpg',
  rating: 4.7,
  status: 'CRITICADO',
  telemetryTag: 'CYB_MATRIX',
  critique: 'Excelente sequência da trilogia do Sprawl.',
  syncDate: '2026-11-07',
  ...overrides,
});

describe('storageService — CRUD, Validações, Isolamento, Telemetria e Exportação', () => {
  it('1. deve inicializar o seed padrão de livros (6) e categorias (5) quando o storage estiver vazio', () => {
    const { books, categories } = loadLocal('user_seed_test');
    expect(books).toHaveLength(6);
    expect(categories).toHaveLength(5);
    expect(categories.map((c) => c.name)).toContain('Cyberpunk');
    expect(books[0].id).toMatch(/^ID_ARQUIVO \/\/ /);
  });

  it('2. deve cadastrar um novo livro válido (RF03) e persistir corretamente no armazenamento local', async () => {
    const uid = 'user_create';
    const newBook = makeValidBook({ id: 'ID_ARQUIVO // 0901-CYB', title: 'Mona Lisa Overdrive' });
    const updated = await saveBookForUser(uid, newBook);

    expect(updated).toHaveLength(7);
    expect(updated[0].title).toBe('Mona Lisa Overdrive');

    const storedRaw = localStorage.getItem(booksKey(uid));
    expect(storedRaw).toBeTruthy();
    const parsed = JSON.parse(storedRaw!) as Book[];
    expect(parsed.some((b) => b.id === 'ID_ARQUIVO // 0901-CYB')).toBe(true);
  });

  it('3. deve editar os dados de um livro existente (RF04) sem duplicar registros', async () => {
    const uid = 'user_edit';
    const initial = loadLocal(uid).books;
    const target = {
      ...initial[0],
      title: 'Neuromancer (Edição Definitiva)',
      rating: 4.9,
      critique: 'Crítica revisada após releitura.',
    };

    const updated = await saveBookForUser(uid, target);
    expect(updated).toHaveLength(initial.length);
    const found = updated.find((b) => b.id === target.id);
    expect(found?.title).toBe('Neuromancer (Edição Definitiva)');
    expect(found?.rating).toBe(4.9);
  });

  it('4. deve excluir um livro existente por ID (RF04)', async () => {
    const uid = 'user_delete';
    const initial = loadLocal(uid).books;
    const idToRemove = initial[0].id;

    const remaining = await deleteBookForUser(uid, idToRemove);
    expect(remaining).toHaveLength(initial.length - 1);
    expect(remaining.some((b) => b.id === idToRemove)).toBe(false);
  });

  it('5. deve permitir salvar uma crítica com exatamente 1000 caracteres (RF07)', async () => {
    const uid = 'user_critique_1000';
    const exact1000 = 'A'.repeat(1000);
    const book = makeValidBook({ id: 'ID_ARQUIVO // 0902-CYB', critique: exact1000 });

    const updated = await saveBookForUser(uid, book);
    expect(updated[0].critique.length).toBe(1000);
  });

  it('6. deve rejeitar e lançar erro explícito quando a crítica ultrapassar 1000 caracteres (ex.: 1001 caracteres)', async () => {
    const uid = 'user_critique_1001';
    const over1001 = 'X'.repeat(1001);
    const invalidBook = makeValidBook({ id: 'ID_ARQUIVO // 0903-CYB', critique: over1001 });

    await expect(saveBookForUser(uid, invalidBook)).rejects.toThrow(/1000 caracteres/i);
    await expect(persistBooks(uid, [invalidBook])).rejects.toThrow(/1000 caracteres/i);
  });

  it('7. deve aceitar notas decimais válidas (0.0 a 5.0) e rejeitar notas menores que 0 ou maiores que 5 (RF06)', async () => {
    const uid = 'user_rating_check';
    const validDecimal = makeValidBook({ id: 'ID_ARQUIVO // 0904-CYB', rating: 4.5 });
    const saved = await saveBookForUser(uid, validDecimal);
    expect(saved[0].rating).toBe(4.5);

    const negativeRating = makeValidBook({ id: 'ID_ARQUIVO // 0905-CYB', rating: -0.5 });
    const aboveFiveRating = makeValidBook({ id: 'ID_ARQUIVO // 0906-CYB', rating: 5.1 });

    await expect(saveBookForUser(uid, negativeRating)).rejects.toThrow(/entre 0\.0 e 5\.0/i);
    await expect(saveBookForUser(uid, aboveFiveRating)).rejects.toThrow(/entre 0\.0 e 5\.0/i);
  });

  it('8. deve criar nova categoria customizada com código de cor Hexadecimal válido (#FF0055) (RF09)', async () => {
    const uid = 'user_cat_hex';
    const newCat: Category = {
      id: 'biopunk',
      name: 'Biopunk',
      color: '#ff0055',
      suffix: 'bio',
    };

    const cats = await createCategoryForUser(uid, newCat);
    const created = cats.find((c) => c.id === 'biopunk');
    expect(created).toBeDefined();
    expect(created?.color).toBe('#FF0055');
    expect(created?.suffix).toBe('BIO');
  });

  it('9. deve rejeitar criação de categoria com código Hexadecimal inválido (RF09)', async () => {
    const uid = 'user_cat_invalid_hex';
    const invalidCat: Category = {
      id: 'glitch',
      name: 'Glitchpunk',
      color: '#GG1234',
      suffix: 'GLT',
    };

    await expect(createCategoryForUser(uid, invalidCat)).rejects.toThrow(/hexadecimal inválido/i);
  });

  it('10. deve excluir categoria existente e migrar livros vinculados para a categoria padrão GERAL sem perda de livros (RF10)', async () => {
    const uid = 'user_cat_remove';
    const { books, categories } = loadLocal(uid);
    const cyberpunkCat = categories.find((c) => c.name === 'Cyberpunk')!;
    const initialCount = books.length;

    const result = await removeCategory(uid, books, categories, cyberpunkCat, DEFAULT_CATEGORY);

    expect(result.books).toHaveLength(initialCount);
    expect(result.categories.some((c) => c.name === 'Cyberpunk')).toBe(false);
    expect(result.categories.some((c) => c.name === 'GERAL')).toBe(true);
    expect(result.books.filter((b) => b.category === 'GERAL').length).toBeGreaterThanOrEqual(2);
  });

  it('11. deve garantir isolamento estrito de dados por usuário: livros salvos por userA não aparecem para userB (RF02)', async () => {
    const exclusiveBook = makeValidBook({
      id: 'ID_ARQUIVO // 0999-CYB',
      title: 'Livro Secreto do Operador A',
    });

    await saveBookForUser('userA', exclusiveBook);
    const userABooks = loadLocal('userA').books;
    const userBBooks = loadLocal('userB').books;

    expect(userABooks.some((b) => b.title === 'Livro Secreto do Operador A')).toBe(true);
    expect(userBBooks.some((b) => b.title === 'Livro Secreto do Operador A')).toBe(false);
  });

  it('12. deve calcular a telemetria global: contagem total de volumes e nota média geral do acervo (RF11)', () => {
    const { books, categories } = loadLocal('user_telemetry_global');
    const telemetry = calculateTelemetry(books, categories, null);

    expect(telemetry.totalVolumes).toBe(6);
    expect(telemetry.globalAverage).toBeCloseTo(4.78, 1);
    expect(telemetry.latestBook).not.toBeNull();
  });

  it('13. deve calcular a telemetria contextual: nota média filtrada por categoria e identificação da categoria dominante (RF11)', () => {
    const { books, categories } = loadLocal('user_telemetry_cat');
    const telemetry = calculateTelemetry(books, categories, 'Cyberpunk');

    expect(telemetry.categoryVolumesCount).toBe(2);
    expect(telemetry.categoryAverage).toBeCloseTo(4.85, 2);
    expect(telemetry.dominantCategory).toBe('Cyberpunk');
    expect(telemetry.dominantPercentage).toBe(33);
  });

  it('14. deve exportar os dados do acervo em estrutura JSON válida contendo livros e categorias (RF15)', () => {
    const { books, categories } = loadLocal('user_export');
    const json = buildExportPayload(books, categories, 'OPERADOR_TESTE');
    const parsed = JSON.parse(json);

    expect(parsed.app).toBe('librarytrix');
    expect(parsed.operator).toBe('OPERADOR_TESTE');
    expect(Array.isArray(parsed.books)).toBe(true);
    expect(Array.isArray(parsed.categories)).toBe(true);
    expect(parsed.books).toHaveLength(6);
  });

  it('15. deve gerar o próximo ID_ARQUIVO sequencial e normalizar buscas ignorando acentos nos 4 campos (RF12)', () => {
    const { books } = loadLocal('user_search_norm');
    const nextId = nextArchiveId(books, 'CYB');
    expect(nextId).toBe('ID_ARQUIVO // 0992-CYB');

    const query = normalize('ficcao');
    const matched = books.filter((b) => normalize(b.category).includes(query));
    expect(matched.length).toBeGreaterThan(0);
    expect(matched[0].category).toBe('Ficção Científica');
  });
});

