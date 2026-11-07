# Evidência de Auditoria de Acessibilidade (WCAG 2.1 / ARIA) — Librarytrix (`v1.2.0`)

**Referência:** Issue #08 (`[A11Y-AUD]`) e Requisitos Não Funcionais `RNF06` / `RNF07` (Usabilidade e Acessibilidade Semântica).
**Data da Auditoria:** 07/11/2026

---

## 1. Auditoria de Contraste Cromático (WCAG 2.1 AA / AAA)

A paleta **Librarytrix Terminal HUD** (`DESIGN.md`) foi aferida quanto à razão de contraste em relação aos fundos escuros `#08080C` (Obsidian Void) e `#0D0E15` (Painel HUD):

| Elemento Visual | Cor de Primeiro Plano | Cor de Fundo | Razão de Contraste | Nível WCAG 2.1 |
| :--- | :---: | :---: | :---: | :---: |
| Texto Principal (`on-surface`) | `#F3F6FC` | `#08080C` | **18.4 : 1** | **AAA** (Exige >= 7.0:1) |
| Destaque Primário / Bordas Ativas (`primary`) | `#00F0FF` | `#08080C` | **13.7 : 1** | **AAA** (Exige >= 7.0:1) |
| Telemetria de Sucesso / Senha Forte | `#39FF14` | `#08080C` | **14.8 : 1** | **AAA** (Exige >= 7.0:1) |
| Alerta / Senha Média (`amber`) | `#FFB800` | `#08080C` | **11.6 : 1** | **AAA** (Exige >= 7.0:1) |
| Erro / Senha Fraca (`magenta`) | `#FF007F` | `#08080C` | **5.4 : 1** | **AA** (Exige >= 4.5:1) |
| Metadados Secundários (`on-surface-variant`) | `#BAC9CC` | `#0D0E15` | **11.2 : 1** | **AAA** (Exige >= 7.0:1) |

---

## 2. Semântica HTML5, Landmarks e Atributos ARIA

1. **Landmarks Estruturais:** Uso explícito de `<header>`, `<aside>`, `<main>`, `<nav>` e `<footer>` tanto no terminal de autenticação (`AuthTerminal.tsx`) quanto no dashboard principal (`App.tsx`).
2. **Modais Nativos (`src/components/Modal.tsx`):** Construídos sobre o elemento semântico `<dialog>` do HTML5 com suporte nativo à tecla `ESC`, foco gerenciado e rótulos claros de fechamento.
3. **Controles de Formulário e Abas (`src/components/AuthTerminal.tsx`):**
   - Abas de modo (`[ AUTENTICAR OPERADOR ]` / `[ REGISTRAR NOVO OPERADOR ]`) utilizam `role="tablist"`, `role="tab"` e `aria-selected={true|false}`.
   - Todos os campos de entrada possuem `<label htmlFor="...">` explicitamente vinculados aos respectivos `id` (`operator-name`, `operator-email`, `operator-password`, `operator-confirm-password`).
   - Botões de alternância de visibilidade de senha contam com `aria-label="Mostrar senha"` / `"Ocultar senha"`.
   - Mensagens de erro de validação e bloqueio são anunciadas em contêineres com `role="alert"`.
4. **Atalhos de Teclado (`RNF07`):**
   - `CTRL+K` (ou `CMD+K`): Foca imediatamente o campo de busca multicritério no cabeçalho.
   - `ESC`: Fecha qualquer janela modal ativa.

---

## 3. Verificação Automatizada na Pipeline de CI

Os critérios de acessibilidade são verificados automaticamente a cada execução do comando `npm test` através da suíte [`src/components/__tests__/a11y.test.tsx`](../../src/components/__tests__/a11y.test.tsx) (3 testes automatizados validando landmarks, associação `label`/`input`, `aria-selected`, `aria-label` e `role="alert"`).
