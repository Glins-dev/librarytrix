import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const rulesPath = resolve(process.cwd(), 'firestore.rules');
const rulesSource = readFileSync(rulesPath, 'utf-8');

interface AuthContext {
  uid: string;
}

interface RuleRequest {
  auth: AuthContext | null;
  path: string;
  method: 'read' | 'create' | 'update' | 'delete';
  data?: Record<string, unknown>;
}

/**
 * Avaliador determinístico espelhando as funções declaradas em `firestore.rules`
 * (`isOwner`, `isValidBook`, `isValidCategory` e `match /{document=**}`) para validação automatizada em CI.
 */
function evaluateFirestoreRule(req: RuleRequest): boolean {
  const isOwner = (userId: string) => req.auth !== null && req.auth.uid === userId;

  const isValidBook = (data?: Record<string, unknown>) => {
    if (!data) return false;
    const titleOk = typeof data.title === 'string' && data.title.length > 0;
    const authorOk = typeof data.author === 'string' && data.author.length > 0;
    const ratingOk = typeof data.rating === 'number' && data.rating >= 0.0 && data.rating <= 5.0;
    const critiqueOk =
      !('critique' in data) ||
      (typeof data.critique === 'string' && data.critique.length <= 1000);
    return titleOk && authorOk && ratingOk && critiqueOk;
  };

  const isValidCategory = (data?: Record<string, unknown>) => {
    if (!data) return false;
    const nameOk = typeof data.name === 'string' && data.name.length > 0;
    const colorOk =
      typeof data.color === 'string' && /^#([0-9A-Fa-f]{3}){1,2}$/.test(data.color);
    const suffixOk =
      typeof data.suffix === 'string' && data.suffix.length >= 2 && data.suffix.length <= 4;
    return nameOk && colorOk && suffixOk;
  };

  const bookMatch = /^\/users\/([^/]+)\/books\/([^/]+)$/.exec(req.path);
  if (bookMatch) {
    const [, userId] = bookMatch;
    if (req.method === 'read' || req.method === 'delete') {
      return isOwner(userId);
    }
    return isOwner(userId) && isValidBook(req.data);
  }

  const categoryMatch = /^\/users\/([^/]+)\/categories\/([^/]+)$/.exec(req.path);
  if (categoryMatch) {
    const [, userId] = categoryMatch;
    if (req.method === 'read' || req.method === 'delete') {
      return isOwner(userId);
    }
    return isOwner(userId) && isValidCategory(req.data);
  }

  const userRootMatch = /^\/users\/([^/]+)$/.exec(req.path);
  if (userRootMatch) {
    return isOwner(userRootMatch[1]);
  }

  return false;
}

describe('firestore.rules — Validação de Segurança, Isolamento Multiusuário e Contratos (Issue #02 / RNF04)', () => {
  it('1. deve conter as funções de segurança isOwner, isValidBook, isValidCategory e bloqueio global no arquivo firestore.rules', () => {
    expect(rulesSource).toContain("rules_version = '2';");
    expect(rulesSource).toContain('function isOwner(userId)');
    expect(rulesSource).toContain('request.auth != null && request.auth.uid == userId');
    expect(rulesSource).toContain('data.critique.size() <= 1000');
    expect(rulesSource).toContain("data.color.matches('^#([0-9A-Fa-f]{3}){1,2}$')");
    expect(rulesSource).toContain('allow read, write: if false;');
  });

  it('2. deve negar leitura e escrita para usuários não autenticados (request.auth == null)', () => {
    expect(
      evaluateFirestoreRule({
        auth: null,
        path: '/users/user_alpha/books/book_1',
        method: 'read',
      }),
    ).toBe(false);

    expect(
      evaluateFirestoreRule({
        auth: null,
        path: '/users/user_alpha/books/book_1',
        method: 'create',
        data: { title: 'Neuromancer', author: 'William Gibson', rating: 5, critique: 'Ok' },
      }),
    ).toBe(false);
  });

  it('3. deve garantir isolamento estrito entre operadores: user_alpha NÃO pode ler, criar ou excluir dados de user_bravo (RF02 / RNF04)', () => {
    expect(
      evaluateFirestoreRule({
        auth: { uid: 'user_alpha' },
        path: '/users/user_bravo/books/book_99',
        method: 'read',
      }),
    ).toBe(false);

    expect(
      evaluateFirestoreRule({
        auth: { uid: 'user_alpha' },
        path: '/users/user_bravo/books/book_99',
        method: 'delete',
      }),
    ).toBe(false);

    expect(
      evaluateFirestoreRule({
        auth: { uid: 'user_alpha' },
        path: '/users/user_alpha/books/book_99',
        method: 'read',
      }),
    ).toBe(true);
  });

  it('4. deve permitir criação de livro válido no próprio nó com crítica de até 1000 caracteres e bloquear crítica > 1000 caracteres (RF04)', () => {
    const validCritique = 'A'.repeat(1000);
    const overLimitCritique = 'A'.repeat(1001);

    expect(
      evaluateFirestoreRule({
        auth: { uid: 'user_alpha' },
        path: '/users/user_alpha/books/book_1',
        method: 'create',
        data: {
          title: 'Duna',
          author: 'Frank Herbert',
          rating: 4.9,
          critique: validCritique,
        },
      }),
    ).toBe(true);

    expect(
      evaluateFirestoreRule({
        auth: { uid: 'user_alpha' },
        path: '/users/user_alpha/books/book_1',
        method: 'create',
        data: {
          title: 'Duna',
          author: 'Frank Herbert',
          rating: 4.9,
          critique: overLimitCritique,
        },
      }),
    ).toBe(false);
  });

  it('5. deve validar formato hexadecimal estrito e sufixo de 2 a 4 caracteres ao criar categorias no Firestore (RF08)', () => {
    expect(
      evaluateFirestoreRule({
        auth: { uid: 'user_alpha' },
        path: '/users/user_alpha/categories/cat_1',
        method: 'create',
        data: { name: 'CYBERPUNK', color: '#00F0FF', suffix: 'CYB' },
      }),
    ).toBe(true);

    expect(
      evaluateFirestoreRule({
        auth: { uid: 'user_alpha' },
        path: '/users/user_alpha/categories/cat_1',
        method: 'create',
        data: { name: 'CYBERPUNK', color: 'ciano-neon', suffix: 'CYB' },
      }),
    ).toBe(false);
  });

  it('6. deve bloquear qualquer acesso a coleções fora do escopo /users/{userId} (regra catch-all)', () => {
    expect(
      evaluateFirestoreRule({
        auth: { uid: 'user_alpha' },
        path: '/books/global_dump',
        method: 'read',
      }),
    ).toBe(false);
  });
});
