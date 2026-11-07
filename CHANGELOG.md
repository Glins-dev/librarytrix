# Changelog

Todas as mudanças notáveis do projeto **Librarytrix** são documentadas neste arquivo.

O formato segue o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e este projeto adere ao [Versionamento Semântico (SemVer)](https://semver.org/lang/pt-BR/).

---

## [1.2.0] - 2026-04-11

### Adicionado
- **Suíte de Testes Automatizados (Vitest + JSDOM):** 34 métodos de teste cobrindo `storageService` (15 testes), `authService` (10 testes), `firestore.rules` (6 testes) e acessibilidade/semântica do `AuthTerminal` (3 testes) (`#1`, `#2`, `#8`).
- **Pipeline de CI/CD e Auditoria de Segurança (`.github/workflows/ci.yml`):** Execução automatizada de build, typecheck, `npm audit` e suíte Vitest em Node.js 22 a cada push e Pull Request (`#4`, `#13`).
- **Artefatos de Governança e Qualidade:** `LICENSE` (MIT), `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/README.md`, templates de Issue/PR em `.github/`, `.github/dependabot.yml` e relatórios de evidência PWA/Acessibilidade em `docs/evidencias/` (`#6`, `#9`–`#15`).

### Alterado
- **Segurança Criptográfica de Senhas (`src/services/authService.ts`):** Substituição do hash `SHA-256` simples no cofre local por derivação de chave **PBKDF2-HMAC-SHA256 com 210.000 iterações** + salt aleatório de 16 bytes (padrão OWASP), incluindo migração transparente de contas legadas no primeiro login (`#3`).

---

## [1.1.1] - 2026-04-06

### Adicionado
- **Documentação Completa de Engenharia de Software (`docs/`):** Sincronização integral de `project-charter.md`, `requisitos.md` (`RF01`–`RF15`, `RNF01`–`RNF10`), `casos-de-uso.md` (`UC01`–`UC04`), `user-stories.md` (`US01`–`US08` em BDD/Gherkin), `arquitetura-der.md` (DER + C4 Níveis 1 a 3 + Sequência) e Matriz de Rastreabilidade Bidirecional.

---

## [1.1.0] - 2026-04-06

### Adicionado
- **Autenticação Multiusuário (`src/components/AuthTerminal.tsx` e `src/services/authService.ts`):** Login e cadastro de operadores com validação de força de senha em barras neon (`FRACA`, `MÉDIA`, `FORTE`), bloqueio temporário contra força bruta (5 tentativas) e integração com Firebase Auth + fallback local.
- **Isolamento Estrito de Acervo por Operador (`src/services/storageService.ts` e `firestore.rules`):** Particionamento por `uid` nas subcoleções `/users/{uid}/books` e `/users/{uid}/categories` e nas chaves `librarytrix_books_${uid}` / `librarytrix_categories_${uid}`.

---

## [1.0.0] - 2026-04-05

### Adicionado
- **Progressive Web App (PWA) e Deploy Ready (`public/manifest.json`, `public/sw.js`, `vercel.json`):** Suporte completo a instalação standalone, cache offline-first via Workbox e roteamento SPA para Vercel (`#13`, `#14`, `#15`).
- **Visão de Classificação Geral (`src/components/RankingView.tsx`):** Ranking do acervo ordenado por nota decimal com destaque para o Top 3 (`#11`, `#12`).

---

## [0.3.0] - 2026-04-04

### Adicionado
- **Editor de Crítica Literária com Limite de 1000 Caracteres (`src/components/CritiqueEditor.tsx`):** Validação estrita em tempo real (`0000 / 1000 CARACTERES`) na camada de UI e serviço (`#8`, `#9`).
- **Busca Multicritério Instantânea (`src/components/Header.tsx`, `src/components/FilterBar.tsx`):** Filtragem simultânea por Título, Autor, Nacionalidade e Ano de Lançamento com atalho `CTRL+K` (`#10`).

---

## [0.2.0] - 2026-04-03

### Adicionado
- **Motor de Persistência Híbrida e Gestão de Categorias Hex (`src/services/storageService.ts`, `src/components/NewCategoryModal.tsx`):** Cadastro de categorias com cor hexadecimal validada e migração automática de obras para `GERAL` ao excluir categoria (`#5`, `#6`, `#7`).

---

## [0.1.0] - 2026-04-02

### Adicionado
- **Fundação do Repositório e Design System HUD (`DESIGN.md`, `tailwind.config.js`, `src/types.ts`):** Configuração inicial React 18 + TypeScript + Vite e tokens visuais *Librarytrix Terminal HUD* (`#1`–`#4`).
