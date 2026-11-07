import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';
import type { OperatorUser } from '../types';

const LOCAL_USERS_KEY = 'librarytrix_users_v1';
const LOCAL_SESSION_KEY = 'librarytrix_session_v1';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000;

interface StoredLocalUser {
  uid: string;
  email: string;
  displayName: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
  failedAttempts?: number;
  lockoutUntil?: number;
}

export type PasswordStrengthLabel = 'FRACA' | 'MÉDIA' | 'FORTE';

export interface PasswordValidation {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumberOrSpecial: boolean;
  isValid: boolean;
  score: 1 | 2 | 3;
  label: PasswordStrengthLabel;
  color: '#ff007f' | '#ffb800' | '#39ff14';
}

/** Avalia os requisitos de segurança e a força visual da senha. */
export function evaluatePassword(password: string): PasswordValidation {
  const minLength = password.length >= 8;
  const hasUpper = /[A-ZÀ-Ý]/.test(password);
  const hasLower = /[a-zà-ý]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password);
  const isValid = minLength && hasUpper && hasLower && hasNumberOrSpecial;

  const passedCount = [minLength, hasUpper, hasLower, hasNumberOrSpecial].filter(Boolean).length;
  const bonusLength = password.length >= 12;

  if (!isValid && passedCount <= 2) {
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumberOrSpecial,
      isValid,
      score: 1,
      label: 'FRACA',
      color: '#ff007f',
    };
  }

  if (isValid && (bonusLength || (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)))) {
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumberOrSpecial,
      isValid,
      score: 3,
      label: 'FORTE',
      color: '#39ff14',
    };
  }

  if (isValid) {
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumberOrSpecial,
      isValid,
      score: 3,
      label: 'FORTE',
      color: '#39ff14',
    };
  }

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumberOrSpecial,
    isValid,
    score: 2,
    label: 'MÉDIA',
    color: '#ffb800',
  };
}

/** Gera um salt criptográfico aleatório de 16 bytes em hexadecimal. */
function generateSalt(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calcula o hash SHA-256 da senha combinada com o salt do usuário usando Web Crypto API.
 * Nunca armazena a senha em texto puro.
 */
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const payload = new TextEncoder().encode(`${salt}::librarytrix::${password}`);
  const digest = await window.crypto.subtle.digest('SHA-256', payload);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function readLocalUsers(): StoredLocalUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredLocalUser[]) : [];
  } catch {
    return [];
  }
}

function writeLocalUsers(users: StoredLocalUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function getStoredSession(): OperatorUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? (JSON.parse(raw) as OperatorUser) : null;
  } catch {
    return null;
  }
}

function setStoredSession(user: OperatorUser | null) {
  if (user) {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
  notifyLocalListeners(user);
}

type AuthListener = (user: OperatorUser | null) => void;
const localListeners = new Set<AuthListener>();

function notifyLocalListeners(user: OperatorUser | null) {
  localListeners.forEach((cb) => cb(user));
}

function mapFirebaseUser(u: FirebaseUser): OperatorUser {
  const fallbackName = u.email ? u.email.split('@')[0].toUpperCase() : 'OPERADOR';
  return {
    uid: u.uid,
    email: u.email ?? '',
    displayName: (u.displayName || fallbackName).trim(),
    createdAt: u.metadata.creationTime ?? new Date().toISOString(),
  };
}

function translateFirebaseError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'ERRO DE AUTENTICAÇÃO: E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'ERRO DE REGISTRO: Este endereço de e-mail já está cadastrado no sistema.';
    case 'auth/invalid-email':
      return 'ERRO DE FORMATO: Endereço de e-mail inválido.';
    case 'auth/weak-password':
      return 'ERRO DE SEGURANÇA: A senha não atende aos critérios mínimos de segurança.';
    case 'auth/too-many-requests':
      return 'BLOQUEIO DE SEGURANÇA: Excesso de tentativas falhas. Aguarde alguns minutos antes de tentar novamente.';
    case 'auth/network-request-failed':
      return 'ERRO DE REDE: Falha na conexão com o servidor de autenticação.';
    default:
      return err instanceof Error ? err.message : 'ERRO: Falha inesperada na autenticação do operador.';
  }
}

/** Inscreve um observador reativo para mudanças de sessão (Firebase Auth ou Fallback Local). */
export function subscribeAuth(callback: AuthListener): () => void {
  if (auth) {
    return onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const mapped = mapFirebaseUser(fbUser);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mapped));
        callback(mapped);
      } else {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        callback(null);
      }
    });
  }

  localListeners.add(callback);
  callback(getStoredSession());
  return () => {
    localListeners.delete(callback);
  };
}

/** Registra um novo operador com validação de força de senha e hash SHA-256 (ou Firebase Auth). */
export async function registerOperator(
  displayName: string,
  email: string,
  password: string,
): Promise<OperatorUser> {
  const cleanName = displayName.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || cleanName.length < 2) {
    throw new Error('ERRO DE REGISTRO: Informe um Nome de Operador / Codinome válido (mínimo 2 caracteres).');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('ERRO DE FORMATO: Informe um endereço de e-mail válido.');
  }

  const validation = evaluatePassword(password);
  if (!validation.isValid) {
    throw new Error(
      'ERRO DE SEGURANÇA: A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 minúscula e 1 número ou símbolo.',
    );
  }

  if (auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(cred.user, { displayName: cleanName });
      const mapped: OperatorUser = {
        uid: cred.user.uid,
        email: cleanEmail,
        displayName: cleanName,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mapped));
      return mapped;
    } catch (err) {
      throw new Error(translateFirebaseError(err));
    }
  }

  const users = readLocalUsers();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('ERRO DE REGISTRO: Este endereço de e-mail já está cadastrado no sistema.');
  }

  const salt = generateSalt();
  const passwordHash = await hashPasswordWithSalt(password, salt);
  const uidBytes = new Uint8Array(6);
  window.crypto.getRandomValues(uidBytes);
  const uid = `op_${Array.from(uidBytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
  const createdAt = new Date().toISOString();

  const newUser: StoredLocalUser = {
    uid,
    email: cleanEmail,
    displayName: cleanName,
    salt,
    passwordHash,
    createdAt,
    failedAttempts: 0,
    lockoutUntil: 0,
  };

  writeLocalUsers([...users, newUser]);

  const sessionUser: OperatorUser = { uid, email: cleanEmail, displayName: cleanName, createdAt };
  setStoredSession(sessionUser);
  return sessionUser;
}

/** Autentica um operador existente via Firebase Auth ou verificação SHA-256 + salt no banco local. */
export async function loginOperator(email: string, password: string): Promise<OperatorUser> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    throw new Error('ERRO DE AUTENTICAÇÃO: Preencha o e-mail e a senha do operador.');
  }

  if (auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const mapped = mapFirebaseUser(cred.user);
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mapped));
      return mapped;
    } catch (err) {
      throw new Error(translateFirebaseError(err));
    }
  }

  const users = readLocalUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (idx === -1) {
    throw new Error('ERRO DE AUTENTICAÇÃO: Credenciais inválidas. Verifique seu e-mail e senha.');
  }

  const target = users[idx];
  const now = Date.now();
  if (target.lockoutUntil && target.lockoutUntil > now) {
    const remainingSec = Math.ceil((target.lockoutUntil - now) / 1000);
    throw new Error(
      `BLOQUEIO DE SEGURANÇA: Conta bloqueada por excesso de tentativas. Aguarde ${remainingSec}s para tentar novamente.`,
    );
  }

  const candidateHash = await hashPasswordWithSalt(password, target.salt);
  if (candidateHash !== target.passwordHash) {
    const nextAttempts = (target.failedAttempts ?? 0) + 1;
    const isLocked = nextAttempts >= MAX_FAILED_ATTEMPTS;
    users[idx] = {
      ...target,
      failedAttempts: isLocked ? 0 : nextAttempts,
      lockoutUntil: isLocked ? now + LOCKOUT_DURATION_MS : 0,
    };
    writeLocalUsers(users);
    if (isLocked) {
      throw new Error(
        'BLOQUEIO DE SEGURANÇA: Excesso de tentativas falhas (5/5). Acesso bloqueado temporariamente por 60 segundos.',
      );
    }
    throw new Error(
      `ERRO DE AUTENTICAÇÃO: Credenciais inválidas. Tentativa ${nextAttempts} de ${MAX_FAILED_ATTEMPTS}.`,
    );
  }

  users[idx] = { ...target, failedAttempts: 0, lockoutUntil: 0 };
  writeLocalUsers(users);

  const sessionUser: OperatorUser = {
    uid: target.uid,
    email: target.email,
    displayName: target.displayName,
    createdAt: target.createdAt,
  };
  setStoredSession(sessionUser);
  return sessionUser;
}

/** Encerra a sessão ativa do operador no Firebase Auth e no armazenamento local. */
export async function logoutOperator(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch {
      /* prossegue limpando a sessão local */
    }
  }
  setStoredSession(null);
}

/** Extrai as 2 iniciais do Nome/Codinome do Operador para exibição no avatar HUD. */
export function getOperatorInitials(displayName: string): string {
  const clean = displayName.trim().replace(/[_-]+/g, ' ');
  if (!clean) return 'OP';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

/** Retorna um identificador curto de nó a partir do UID do operador (ex.: #A4F2). */
export function getOperatorNodeId(uid: string): string {
  const clean = uid.replace(/^op_/, '').toUpperCase();
  return `#${clean.slice(0, 4).padEnd(4, '0')}`;
}

