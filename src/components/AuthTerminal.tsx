import { useState, type FormEvent } from 'react';
import {
  evaluatePassword,
  loginOperator,
  registerOperator,
} from '../services/authService';
import { isFirebaseConfigured } from '../services/firebase';
import type { OperatorUser } from '../types';

interface Props {
  onAuthenticated: (user: OperatorUser) => void;
}

type AuthMode = 'login' | 'register';

export default function AuthTerminal({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pwdCheck = evaluatePassword(password);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (!displayName.trim() || displayName.trim().length < 2) {
        setError('ERRO DE REGISTRO: Informe um Nome de Operador / Codinome válido (mínimo 2 caracteres).');
        return;
      }
      if (!pwdCheck.isValid) {
        setError(
          'ERRO DE SEGURANÇA: A senha deve conter no mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 número ou símbolo.',
        );
        return;
      }
      if (password !== confirmPassword) {
        setError('ERRO DE VALIDAÇÃO: A confirmação de senha não coincide com a senha digitada.');
        return;
      }
    }

    setLoading(true);
    try {
      const user =
        mode === 'login'
          ? await loginOperator(email, password)
          : await registerOperator(displayName, email, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ERRO: Falha inesperada na operação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08080C] text-on-surface flex flex-col justify-between overflow-x-hidden selection:bg-[#00F0FF] selection:text-[#08080C]">
      <div className="scanlines fixed inset-0 z-50 pointer-events-none" />

      {/* Top HUD Bar */}
      <header className="w-full px-4 lg:px-8 h-12 border-b border-outline-variant bg-[#0D0E15] flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#00F0FF] text-[18px]">shield_lock</span>
          <span className="font-title-md text-title-md tracking-wider text-[#00F0FF]">
            LIBRARYTRIX // CONTROLE DE ACESSO
          </span>
          <span className="hidden sm:inline px-1.5 py-0.5 bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] text-code-dense font-code-dense">
            PORTAL_SEGURANÇA_V4.2
          </span>
        </div>
        <div className="flex items-center gap-2 text-code-dense font-code-dense">
          <span className="w-2 h-2 bg-[#39ff14] inline-block" />
          <span className="text-outline hidden md:inline">PROVEDOR:</span>
          <span className="text-[#39ff14]">
            {isFirebaseConfigured ? 'FIREBASE_AUTH // NUVEM' : 'CRIPTO_SHA256 // COFRE_LOCAL'}
          </span>
        </div>
      </header>

      {/* Main Centered Auth Terminal */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-20">
        <div className="relative w-full max-w-xl bg-[#0D0E15] border border-[#00F0FF] hud-glow-cyan p-5 sm:p-8">
          {/* Cantoneiras HUD (4 cantos táticos) */}
          <span className="pointer-events-none absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#00F0FF]" />
          <span className="pointer-events-none absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#00F0FF]" />
          <span className="pointer-events-none absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#00F0FF]" />
          <span className="pointer-events-none absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#00F0FF]" />

          {/* Header do Painel */}
          <div className="border-b border-outline-variant pb-4 mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-code-dense font-code-dense text-[#00F0FF] tracking-widest uppercase">
                AUTENTICAÇÃO MULTIUSUÁRIO // ISOLAMENTO DE ACERVO
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                TERMINAL DO OPERADOR
              </h1>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                Cada operador possui credenciais criptografadas e banco de livros/categorias isolado.
              </p>
            </div>
            <div className="px-2 py-1 bg-surface-container-lowest border border-outline-variant text-code-dense font-code-dense text-outline shrink-0">
              SHA-256 + SALT
            </div>
          </div>

          {/* Abas de Operação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => switchMode('login')}
              className={`py-2.5 px-3 font-label-sm text-label-sm font-bold tracking-wider border transition-colors text-center ${
                mode === 'login'
                  ? 'bg-[#00F0FF] text-[#08080C] border-[#00F0FF] neon-glow-cyan'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-[#00F0FF]/60 hover:text-on-surface'
              }`}
            >
              [ AUTENTICAR OPERADOR ]
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => switchMode('register')}
              className={`py-2.5 px-3 font-label-sm text-label-sm font-bold tracking-wider border transition-colors text-center ${
                mode === 'register'
                  ? 'bg-[#00F0FF] text-[#08080C] border-[#00F0FF] neon-glow-cyan'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-[#00F0FF]/60 hover:text-on-surface'
              }`}
            >
              [ REGISTRAR NOVO OPERADOR ]
            </button>
          </div>

          {/* Alerta de Erro */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3 bg-[#ff007f]/10 border border-[#ff007f] text-[#ff007f] text-label-sm font-label-sm flex items-start gap-2"
            >
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">warning</span>
              <span>{error}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="operator-name"
                  className="block text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1.5"
                >
                  NOME DE OPERADOR / CODINOME &gt;
                </label>
                <div className="flex items-center bg-[#08080C] border border-outline-variant focus-within:border-[#00F0FF] px-3 py-2">
                  <span className="material-symbols-outlined text-outline text-[18px] mr-2">badge</span>
                  <input
                    id="operator-name"
                    type="text"
                    required
                    maxLength={40}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ex.: OPERADOR_NEON ou Guilherme Lins"
                    className="w-full bg-transparent border-none p-0 text-body-md font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="operator-email"
                className="block text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1.5"
              >
                E-MAIL DO OPERADOR &gt;
              </label>
              <div className="flex items-center bg-[#08080C] border border-outline-variant focus-within:border-[#00F0FF] px-3 py-2">
                <span className="material-symbols-outlined text-outline text-[18px] mr-2">alternate_email</span>
                <input
                  id="operator-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operador@librarytrix.io"
                  className="w-full bg-transparent border-none p-0 text-body-md font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="operator-password"
                className="block text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1.5"
              >
                CHAVE DE ACESSO (SENHA) &gt;
              </label>
              <div className="flex items-center bg-[#08080C] border border-outline-variant focus-within:border-[#00F0FF] px-3 py-2">
                <span className="material-symbols-outlined text-outline text-[18px] mr-2">key</span>
                <input
                  id="operator-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-none p-0 text-body-md font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="text-code-dense font-code-dense text-outline hover:text-[#00F0FF] px-2 py-0.5 border border-outline-variant hover:border-[#00F0FF] ml-2 flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>{showPassword ? 'OCULTAR' : 'MOSTRAR'}</span>
                </button>
              </div>

              {/* Medidor de Força de Senha em Barras Neon */}
              {(mode === 'register' || password.length > 0) && (
                <div className="mt-2.5 p-2.5 bg-[#08080C] border border-outline-variant space-y-2">
                  <div className="flex items-center justify-between text-code-dense font-code-dense">
                    <span className="text-outline">FORÇA DA SENHA // TELEMETRIA</span>
                    <span className="font-bold" style={{ color: pwdCheck.color }}>
                      [ {pwdCheck.label} ]
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 2, 3].map((bar) => {
                      const active = password.length > 0 && pwdCheck.score >= bar;
                      return (
                        <div
                          key={bar}
                          className="h-1.5 transition-all duration-150"
                          style={{
                            backgroundColor: active ? pwdCheck.color : '#25252b',
                            boxShadow: active ? `0 0 8px ${pwdCheck.color}` : 'none',
                          }}
                        />
                      );
                    })}
                  </div>
                  {mode === 'register' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-code-dense font-code-dense">
                      <span className={pwdCheck.minLength ? 'text-[#39ff14]' : 'text-outline'}>
                        {pwdCheck.minLength ? '[OK]' : '[--]'} Mínimo de 8 caracteres
                      </span>
                      <span className={pwdCheck.hasUpper ? 'text-[#39ff14]' : 'text-outline'}>
                        {pwdCheck.hasUpper ? '[OK]' : '[--]'} 1 letra maiúscula (A-Z)
                      </span>
                      <span className={pwdCheck.hasLower ? 'text-[#39ff14]' : 'text-outline'}>
                        {pwdCheck.hasLower ? '[OK]' : '[--]'} 1 letra minúscula (a-z)
                      </span>
                      <span className={pwdCheck.hasNumberOrSpecial ? 'text-[#39ff14]' : 'text-outline'}>
                        {pwdCheck.hasNumberOrSpecial ? '[OK]' : '[--]'} 1 número ou símbolo
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label
                  htmlFor="operator-confirm-password"
                  className="block text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1.5"
                >
                  CONFIRMAR CHAVE DE ACESSO &gt;
                </label>
                <div className="flex items-center bg-[#08080C] border border-outline-variant focus-within:border-[#00F0FF] px-3 py-2">
                  <span className="material-symbols-outlined text-outline text-[18px] mr-2">verified_user</span>
                  <input
                    id="operator-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha definida acima"
                    className="w-full bg-transparent border-none p-0 text-body-md font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    aria-label={showConfirmPassword ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                    className="text-code-dense font-code-dense text-outline hover:text-[#00F0FF] px-2 py-0.5 border border-outline-variant hover:border-[#00F0FF] ml-2 flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                    <span>{showConfirmPassword ? 'OCULTAR' : 'MOSTRAR'}</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00F0FF] hover:bg-primary-fixed-dim disabled:opacity-50 text-[#08080C] font-label-md text-label-md font-bold tracking-wider uppercase transition-all neon-glow-cyan flex items-center justify-center gap-2 mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {mode === 'login' ? 'login' : 'person_add'}
              </span>
              <span>
                {loading
                  ? 'PROCESSANDO CREDENCIAIS...'
                  : mode === 'login'
                    ? '[ INICIAR SESSÃO DO OPERADOR ]'
                    : '[ CRIAR CONTA E INICIALIZAR ACERVO ]'}
              </span>
            </button>
          </form>
        </div>
      </main>

      {/* Rodapé de Segurança */}
      <footer className="w-full px-4 lg:px-8 py-2.5 border-t border-outline-variant bg-[#0D0E15] flex flex-wrap items-center justify-between gap-2 text-code-dense font-code-dense text-outline z-20">
        <span>SEGURANÇA: HASH SHA-256 COM SALT POR OPERADOR</span>
        <span>ISOLAMENTO: DADOS VINCULADOS AO UID DA CONTA</span>
        <span className="text-[#00F0FF]">STATUS DO SISTEMA: PROTEGIDO</span>
      </footer>
    </div>
  );
}

