import { describe, expect, it } from 'vitest';
import {
  evaluatePassword,
  getOperatorInitials,
  getStoredSession,
  loginOperator,
  logoutOperator,
  registerOperator,
} from '../authService';

describe('authService — Registro, Hash SHA-256 + Salt, Login, Força de Senha e Sessão', () => {
  it('1. deve registrar um novo usuário local com sucesso e gerar um UID único (RF01)', async () => {
    const user = await registerOperator('OPERADOR_ALPHA', 'alpha@librarytrix.io', 'Cyber@2026');

    expect(user.uid).toMatch(/^op_[0-9a-f]{12}$/);
    expect(user.displayName).toBe('OPERADOR_ALPHA');
    expect(user.email).toBe('alpha@librarytrix.io');
    expect(getStoredSession()?.uid).toBe(user.uid);
  });

  it('2. deve bloquear o cadastro quando o endereço de e-mail já estiver registrado (RF01)', async () => {
    await registerOperator('OPERADOR_UM', 'duplicado@librarytrix.io', 'Cyber@2026');

    await expect(
      registerOperator('OPERADOR_DOIS', 'DUPLICADO@librarytrix.io', 'OutraSenha@99'),
    ).rejects.toThrow(/já está cadastrado/i);
  });

  it('3. deve garantir segurança de senha no localStorage: nunca salvar em texto puro, armazenando apenas hash SHA-256 + salt (RNF03)', async () => {
    const plainPassword = 'SuperSecretPassword!2026';
    await registerOperator('OPERADOR_CRIPTO', 'cripto@librarytrix.io', plainPassword);

    const rawUsers = localStorage.getItem('librarytrix_users_v1');
    expect(rawUsers).toBeTruthy();
    expect(rawUsers).not.toContain(plainPassword);

    const parsed = JSON.parse(rawUsers!) as Array<{
      email: string;
      salt: string;
      passwordHash: string;
      password?: string;
    }>;
    expect(parsed).toHaveLength(1);
    expect(parsed[0].password).toBeUndefined();
    expect(parsed[0].salt).toMatch(/^[0-9a-f]{32}$/);
    expect(parsed[0].passwordHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('4. deve autenticar (login) com credenciais válidas e retornar a sessão ativa do operador (RF01)', async () => {
    await registerOperator('OPERADOR_BRAVO', 'bravo@librarytrix.io', 'Matrix#2026');
    await logoutOperator();
    expect(getStoredSession()).toBeNull();

    const logged = await loginOperator('bravo@librarytrix.io', 'Matrix#2026');
    expect(logged.displayName).toBe('OPERADOR_BRAVO');
    expect(getStoredSession()?.email).toBe('bravo@librarytrix.io');
  });

  it('5. deve falhar o login ao informar uma senha incorreta para um operador existente (RF01)', async () => {
    await registerOperator('OPERADOR_DELTA', 'delta@librarytrix.io', 'SenhaCorreta@1');
    await logoutOperator();

    await expect(loginOperator('delta@librarytrix.io', 'SenhaErrada@2')).rejects.toThrow(
      /Credenciais inválidas/i,
    );
  });

  it('6. deve falhar o login ao informar um endereço de e-mail inexistente (RF01)', async () => {
    await expect(loginOperator('fantasma@librarytrix.io', 'Qualquer@123')).rejects.toThrow(
      /Credenciais inválidas/i,
    );
  });

  it('7. deve validar os requisitos de força de senha (mínimo 8 caracteres, maiúscula, minúscula e número/especial) (RNF03)', async () => {
    const weak = evaluatePassword('abc12');
    expect(weak.isValid).toBe(false);
    expect(weak.label).toBe('FRACA');
    expect(weak.color).toBe('#ff007f');

    const medium = evaluatePassword('ApenasLetras');
    expect(medium.isValid).toBe(false);
    expect(medium.label).toBe('MÉDIA');
    expect(medium.color).toBe('#ffb800');

    const strong = evaluatePassword('Neuromancer@2026');
    expect(strong.isValid).toBe(true);
    expect(strong.label).toBe('FORTE');
    expect(strong.color).toBe('#39ff14');

    await expect(registerOperator('OPERADOR', 'fraca@librarytrix.io', 'fraca123')).rejects.toThrow(
      /mínimo 8 caracteres/i,
    );
  });

  it('8. deve encerrar a sessão (logout) limpando imediatamente o usuário ativo e calcular iniciais do avatar (RF01)', async () => {
    await registerOperator('Guilherme Lins', 'glins@librarytrix.io', 'Cyber#2026');
    expect(getStoredSession()).not.toBeNull();
    expect(getOperatorInitials('Guilherme Lins')).toBe('GL');

    await logoutOperator();
    expect(getStoredSession()).toBeNull();
  });
});

