import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import AuthTerminal from '../AuthTerminal';

function renderComponent(ui: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(ui);
  });
  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

describe('AuthTerminal — Auditoria de Acessibilidade (WCAG / ARIA) e Semântica de Formulário (Issue #08)', () => {
  it('1. deve renderizar landmarks semânticos (header, main, footer, h1) e abas com role="tablist" e aria-selected', () => {
    const onAuth = vi.fn();
    const { container, unmount } = renderComponent(<AuthTerminal onAuthenticated={onAuth} />);

    expect(container.querySelector('header')).not.toBeNull();
    expect(container.querySelector('main')).not.toBeNull();
    expect(container.querySelector('footer')).not.toBeNull();

    const heading = container.querySelector('h1');
    expect(heading?.textContent).toMatch(/TERMINAL DO OPERADOR/i);

    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    unmount();
  });

  it('2. deve associar todos os inputs de login e cadastro a labels explícitas (htmlFor / id) e botões com aria-label', () => {
    const onAuth = vi.fn();
    const { container, unmount } = renderComponent(<AuthTerminal onAuthenticated={onAuth} />);

    const emailLabel = container.querySelector('label[for="operator-email"]');
    const emailInput = container.querySelector('#operator-email') as HTMLInputElement;
    const passwordLabel = container.querySelector('label[for="operator-password"]');
    const passwordInput = container.querySelector('#operator-password') as HTMLInputElement;

    expect(emailLabel).not.toBeNull();
    expect(emailInput.type).toBe('email');
    expect(passwordLabel).not.toBeNull();
    expect(passwordInput.type).toBe('password');

    const toggleBtn = container.querySelector('button[aria-label="Mostrar senha"]') as HTMLButtonElement;
    expect(toggleBtn).not.toBeNull();
    act(() => {
      toggleBtn.click();
    });
    expect(passwordInput.type).toBe('text');

    const tabs = container.querySelectorAll('[role="tab"]');
    act(() => {
      (tabs[1] as HTMLButtonElement).click();
    });

    expect(container.querySelector('label[for="operator-name"]')).not.toBeNull();
    expect(container.querySelector('#operator-name')).not.toBeNull();
    expect(container.querySelector('label[for="operator-confirm-password"]')).not.toBeNull();
    expect(container.querySelector('#operator-confirm-password')).not.toBeNull();
    unmount();
  });

  it('3. deve exibir mensagens de erro de validação dentro de uma região acessível role="alert"', () => {
    const onAuth = vi.fn();
    const { container, unmount } = renderComponent(<AuthTerminal onAuthenticated={onAuth} />);

    const tabs = container.querySelectorAll('[role="tab"]');
    act(() => {
      (tabs[1] as HTMLButtonElement).click();
    });

    const form = container.querySelector('form') as HTMLFormElement;
    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    const alertRegion = container.querySelector('[role="alert"]');
    expect(alertRegion).not.toBeNull();
    expect(alertRegion?.textContent).toMatch(/ERRO DE REGISTRO/i);
    unmount();
  });
});
