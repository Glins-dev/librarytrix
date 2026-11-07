# Backlog de Issues, Git Flow e Versionamento Semântico (SemVer) — Librarytrix

---

## 1. Governança de Configuração e Convenções

- **Padrão de Branches (Git Flow):**
  - `main`: Branch de produção estável. Recebe exclusivamente merges `--no-ff` vindos da `develop` a cada marco de release, acompanhados de tags anotadas SemVer (`v0.1.0`, `v0.2.0`, `v0.3.0`, `v1.0.0`, `v1.1.0`).
  - `develop`: Branch de integração contínua das entregas temáticas.
  - `chore/issue-XX-*`, `docs/issue-XX-*`, `feature/issue-XX-*`: Branches temáticas criadas a partir da `develop` para cada uma das 15 Issues do backlog e integradas de volta à `develop` com `git merge --no-ff`.
- **Padrão de Commits Atômicos (Conventional Commits):**
  - Formato: `<tipo>(<escopo>): <descrição imperativa em pt-br> (Closes #<número>)`
  - Tipos utilizados: `chore`, `docs`, `feat`, `fix`, `refactor`, `style`.
- **Labels Padronizadas no Repositório:**
  - `chore` (`#3b494b`), `docs` (`#849495`), `design` (`#a855f7`), `data` (`#39ff14`), `feature` (`#00f0ff`), `pwa` (`#ffb800`), `priority:high` (`#ff007f`), `priority:medium` (`#ffb800`).

---

## 2. Visão Geral das 15 Issues e Marcos SemVer

| Issue | Título | Labels | Branch (Git Flow) | Commit Atômico (Conventional Commits) | Marco SemVer |
|-------|--------|--------|-------------------|---------------------------------------|--------------|
| **#1** | Configurar dependências React, TypeScript e Vite | `chore`, `priority:high` | `chore/issue-01-setup-projeto` | `chore(setup): configurar dependencias react typescript e vite (Closes #1)` | `v0.1.0` |
| **#2** | Elaborar Termo de Abertura do Projeto (Project Charter) | `docs`, `priority:high` | `docs/issue-02-project-charter` | `docs(charter): elaborar termo de abertura do projeto (Closes #2)` | `v0.1.0` |
| **#3** | Especificar Requisitos Funcionais e Não Funcionais | `docs`, `priority:high` | `docs/issue-03-requisitos` | `docs(requisitos): especificar requisitos funcionais e nao funcionais (Closes #3)` | `v0.1.0` |
| **#4** | Detalhar Casos de Uso e Diagramas Arquiteturais | `docs`, `priority:high` | `docs/issue-04-casos-de-uso` | `docs(uc): detalhar casos de uso e diagramas arquiteturais (Closes #4)` | `v0.1.0` |
| **#5** | Documentar User Stories em BDD e Backlog de Issues | `docs`, `priority:high` | `docs/issue-05-user-stories` | `docs(stories): documentar user stories em bdd e backlog de issues (Closes #5)` | **`v0.1.0`** |
| **#6** | Implementar Design System Cyberpunk Terminal HUD | `design`, `priority:high` | `feature/issue-06-design-system-cyberpunk` | `feat(ui): implementar design system cyberpunk terminal hud (Closes #6)` | `v0.2.0` |
| **#7** | Implementar autenticação multiusuário, persistência Firebase e storage local isolado | `data`, `priority:high` | `feature/issue-07-tipos-e-persistencia` | `feat(db): implementar servico de persistencia firebase e storage local (Closes #7)` | `v0.2.0` |
| **#8** | Implementar cadastro, edição e exclusão de livros | `feature`, `priority:high` | `feature/issue-08-crud-livros` | `feat(books): implementar cadastro edicao e exclusao de livros (Closes #8)` | `v0.2.0` |
| **#9** | Aplicar limite de 1000 caracteres na crítica com contador em tempo real | `feature`, `priority:high` | `feature/issue-09-validacao-critica-1000-chars` | `feat(critique): aplicar limite de 1000 caracteres com contador em tempo real (Closes #9)` | `v0.2.0` |
| **#10** | Implementar criação com cor Hexadecimal e exclusão de categorias | `feature`, `priority:high` | `feature/issue-10-gestao-categorias-hex` | `feat(categories): implementar criacao com cor hexadecimal e exclusao de categorias (Closes #10)` | **`v0.2.0`** |
| **#11** | Construir grid de cards com avaliação HUD de 0 a 5 | `feature`, `design`, `priority:high` | `feature/issue-11-listagem-cards-hud` | `feat(catalog): construir grid de cards com avaliacao hud de 0 a 5 (Closes #11)` | `v0.3.0` |
| **#12** | Implementar painel superior com 4 métricas dinâmicas | `feature`, `priority:medium` | `feature/issue-12-telemetria-dinamica` | `feat(telemetry): implementar painel superior com 4 metricas dinamicas (Closes #12)` | `v0.3.0` |
| **#13** | Implementar busca multicritério em 4 campos, filtros e shell em PT-BR | `feature`, `priority:high` | `feature/issue-13-filtros-e-busca-ptbr` | `feat(search): implementar busca multicriterio e filtros combinados em pt-br (Closes #13)` | `v0.3.0` |
| **#14** | Adicionar ranqueamento por nota e exportação JSON | `feature`, `priority:medium` | `feature/issue-14-ranking-e-exportacao` | `feat(ranking): adicionar ranqueamento por nota e exportacao json (Closes #14)` | **`v0.3.0`** |
| **#15** | Finalizar configuração PWA e documentação principal sincronizada | `pwa`, `docs`, `priority:medium` | `feature/issue-15-pwa-e-readme` | `docs(readme): finalizar configuracao pwa e documentacao principal sincronizada (Closes #15)` | **`v1.0.0`** |

---

## 3. Detalhamento Completo das 15 Issues

### Issue #1 — Configurar dependências React, TypeScript e Vite
- **Labels:** `chore`, `priority:high`
- **Branch Git Flow:** `chore/issue-01-setup-projeto`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "chore(setup): configurar dependencias react typescript e vite (Closes #1)"
  ```
- **Descrição:** Estruturar a base do projeto com React 18, TypeScript 5 em modo estrito (`strict: true`), Vite e plugin PWA (`vite-plugin-pwa`), além dos arquivos `.gitignore` e `.env.example`.
- **Critérios de Aceite:**
  - [x] `package.json`, `tsconfig.json` e `vite.config.ts` configurados.
  - [x] `.env.example` documentando as variáveis `VITE_FIREBASE_*`.
  - [x] Execução de `npm run typecheck` e `npm run build` sem erros.

---

### Issue #2 — Elaborar Termo de Abertura do Projeto (Project Charter)
- **Labels:** `docs`, `priority:high`
- **Branch Git Flow:** `docs/issue-02-project-charter`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "docs(charter): elaborar termo de abertura do projeto (Closes #2)"
  ```
- **Descrição:** Redigir o documento `docs/project-charter.md` estabelecendo a justificativa do sistema, visão geral, 5 Objetivos SMART, escopo *In/Out* e matriz de Stakeholders.
- **Critérios de Aceite:**
  - [x] Justificativa clara do problema resolvido pelo Librarytrix.
  - [x] 5 Objetivos SMART mensuráveis e temporalmente definidos.
  - [x] Escopo preliminar (dentro e fora da entrega) e tabela de Stakeholders/riscos.

---

### Issue #3 — Especificar Requisitos Funcionais e Não Funcionais
- **Labels:** `docs`, `priority:high`
- **Branch Git Flow:** `docs/issue-03-requisitos`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "docs(requisitos): especificar requisitos funcionais e nao funcionais (Closes #3)"
  ```
- **Descrição:** Documentar em `docs/requisitos.md` os Requisitos Funcionais (`[RF01]` a `[RF15]`) e Não Funcionais (`[RNF01]` a `[RNF10]`) acompanhados da matriz de rastreabilidade horizontal.
- **Critérios de Aceite:**
  - [x] Cobertura de `[RF01]` a `[RF15]` (autenticação, isolamento, CRUD, crítica 1000 chars, categorias hex, telemetria, busca 4 campos e exportação).
  - [x] Cobertura de `[RNF01]` a `[RNF10]` (React/TS, Tailwind HUD, SHA-256/Firebase Auth, Firestore Rules, PWA, desempenho e deploy).

---

### Issue #4 — Detalhar Casos de Uso e Diagramas Arquiteturais
- **Labels:** `docs`, `priority:high`
- **Branch Git Flow:** `docs/issue-04-casos-de-uso`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "docs(uc): detalhar casos de uso e diagramas arquiteturais (Closes #4)"
  ```
- **Descrição:** Produzir `docs/casos-de-uso.md` (fluxos principais, alternativos e de exceção) e `docs/arquitetura-der.md` (DER com `USER`, `CATEGORY` e `BOOK` e diagramas C4 em Mermaid.js).
- **Critérios de Aceite:**
  - [x] Especificação formal de `UC01` a `UC07`.
  - [x] Diagrama Entidade-Relacionamento (`erDiagram`) contemplando `USER`, `CATEGORY` e `BOOK`.
  - [x] Diagramas C4 e de sequência renderizáveis em Mermaid.

---

### Issue #5 — Documentar User Stories em BDD e Backlog de Issues
- **Labels:** `docs`, `priority:high`
- **Branch Git Flow:** `docs/issue-05-user-stories`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "docs(stories): documentar user stories em bdd e backlog de issues (Closes #5)"
  ```
- **Marco SemVer ao concluir:** **`v0.1.0`** (`Release v0.1.0: Documentacao de Planejamento e Setup Inicial`)
- **Descrição:** Documentar as histórias de usuário em `docs/user-stories.md` com cenários Gherkin (`Dado / Quando / Então`) e estruturar `docs/github-issues-backlog.md`.
- **Critérios de Aceite:**
  - [x] Histórias no formato canônico ("Como [ator], quero [ação] para que [valor]").
  - [x] Critérios de aceite em Gherkin cobrindo fluxos normais e de exceção.

---

### Issue #6 — Implementar Design System Cyberpunk Terminal HUD
- **Labels:** `design`, `priority:high`
- **Branch Git Flow:** `feature/issue-06-design-system-cyberpunk`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(ui): implementar design system cyberpunk terminal hud (Closes #6)"
  ```
- **Descrição:** Configurar tokens visuais em `tailwind.config.js`, `postcss.config.js`, `src/index.css` e `DESIGN.md` (paleta obsidiana `#08080C`, scanlines, brilhos neon, fontes `Space Grotesk` e `JetBrains Mono` e geometria `0px`).
- **Critérios de Aceite:**
  - [x] `border-radius: 0px` global em todos os elementos.
  - [x] Classes utilitárias `.scanlines`, `.hud-glow-cyan` e `.neon-glow-cyan` operacionais.

---

### Issue #7 — Implementar serviço de autenticação, persistência Firebase e storage local isolado
- **Labels:** `data`, `priority:high`
- **Branch Git Flow:** `feature/issue-07-tipos-e-persistencia`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(db): implementar servico de persistencia firebase e storage local (Closes #7)"
  ```
- **Descrição:** Implementar `src/types/index.ts`, `src/utils.ts`, `src/services/firebase.ts`, `src/services/authService.ts`, `src/services/storageService.ts`, `src/services/seed.ts` e `firestore.rules`.
- **Critérios de Aceite:**
  - [x] Autenticação via Firebase Auth com fallback local usando `window.crypto.subtle.digest('SHA-256', ...)` + *salt* por usuário (zero senhas em texto puro).
  - [x] Isolamento de acervo por `uid` (`users/{uid}/books`, `users/{uid}/categories` e `librarytrix_books_${uid}`).
  - [x] Arquivo `firestore.rules` garantindo acesso exclusivo ao proprietário (`request.auth.uid == userId`) e `critique.size() <= 1000`.

---

### Issue #8 — Implementar cadastro, edição e exclusão de livros
- **Labels:** `feature`, `priority:high`
- **Branch Git Flow:** `feature/issue-08-crud-livros`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(books): implementar cadastro edicao e exclusao de livros (Closes #8)"
  ```
- **Descrição:** Construir `src/components/Modal.tsx` e `src/components/NewBookModal.tsx` para criação, edição e exclusão de livros com validações e geração de `ID_ARQUIVO // NNNN-SUF`.
- **Critérios de Aceite:**
  - [x] Validação de campos obrigatórios e nota entre `0.0` e `5.0`.
  - [x] Geração sequencial de `ID_ARQUIVO //` com o sufixo da categoria selecionada.
  - [x] Exclusão de livro com diálogo de confirmação.

---

### Issue #9 — Aplicar limite de 1000 caracteres na crítica com contador em tempo real
- **Labels:** `feature`, `priority:high`
- **Branch Git Flow:** `feature/issue-09-validacao-critica-1000-chars`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(critique): aplicar limite de 1000 caracteres com contador em tempo real (Closes #9)"
  ```
- **Descrição:** Implementar `src/components/CritiqueEditor.tsx` e `src/components/CritiqueModal.tsx` com trava estrita em 1000 caracteres e leitura completa em modal dedicado.
- **Critérios de Aceite:**
  - [x] `maxLength={1000}` no `<textarea>` e validação `critique.length <= 1000`.
  - [x] Contador `CARACTERES: XXX / 1000` mudando para amarelo (`#ffb800`) acima de 900 e magenta (`#ff007f`) em 1000.
  - [x] Modal `[ VER CRÍTICA COMPLETA ]` com opção `[ EDITAR NO REGISTRO ]`.

---

### Issue #10 — Implementar criação com cor Hexadecimal e exclusão de categorias
- **Labels:** `feature`, `priority:high`
- **Branch Git Flow:** `feature/issue-10-gestao-categorias-hex`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(categories): implementar criacao com cor hexadecimal e exclusao de categorias (Closes #10)"
  ```
- **Marco SemVer ao concluir:** **`v0.2.0`** (`Release v0.2.0: Core CRUD de Livros, Criticas de 1000 Caracteres e Categorias Customizadas`)
- **Descrição:** Implementar `src/components/NewCategoryModal.tsx` (presets + código hexadecimal customizado + color picker + preview) e `src/components/ConfirmCategoryDelete.tsx` (exclusão com migração para `GERAL`).
- **Critérios de Aceite:**
  - [x] Input hexadecimal validado por `/^#([0-9A-F]{3}){1,2}$/i` sincronizado com `<input type="color">` e preview da etiqueta.
  - [x] Exclusão de categoria reatribuindo livros vinculados automaticamente para `GERAL` (`#849495`).

---

### Issue #11 — Construir grid de cards com avaliação HUD de 0 a 5
- **Labels:** `feature`, `design`, `priority:high`
- **Branch Git Flow:** `feature/issue-11-listagem-cards-hud`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(catalog): construir grid de cards com avaliacao hud de 0 a 5 (Closes #11)"
  ```
- **Descrição:** Desenvolver `src/components/RatingBar.tsx` e `src/components/BookCard.tsx` com cores dinâmicas aplicadas via `style` inline.
- **Critérios de Aceite:**
  - [x] Barra HUD segmentada em 5 células com preenchimento proporcional para notas decimais.
  - [x] Cores da categoria aplicadas dinamicamente em bordas, badges e textos do card.

---

### Issue #12 — Implementar painel superior com 4 métricas dinâmicas
- **Labels:** `feature`, `priority:medium`
- **Branch Git Flow:** `feature/issue-12-telemetria-dinamica`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(telemetry): implementar painel superior com 4 metricas dinamicas (Closes #12)"
  ```
- **Descrição:** Implementar `src/components/TelemetryStrip.tsx` (Desktop e Mobile) com os 4 blocos de telemetria em tempo real.
- **Critérios de Aceite:**
  - [x] Bloco 1: `REGISTROS // TOTAL` (`SIS:ATIVO`, total absoluto de livros).
  - [x] Bloco 2: `MÉTRICA // GERAL` ou `MÉTRICA // [CATEGORIA]` com cor hexadecimal dinâmica da categoria ativa.
  - [x] Bloco 3: `ÚLTIMO REGISTRO // ADIÇÃO` com título truncado, autor e nota do último livro cadastrado.
  - [x] Bloco 4: `DADOS // DOMINÂNCIA` (`MAIOR CATEGORIA`) com nome, percentual e cor da categoria dominante.

---

### Issue #13 — Implementar busca multicritério em 4 campos, tela de login e filtros em PT-BR
- **Labels:** `feature`, `priority:high`
- **Branch Git Flow:** `feature/issue-13-filtros-e-busca-ptbr`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(search): implementar busca multicriterio e filtros combinados em pt-br (Closes #13)"
  ```
- **Descrição:** Implementar `src/components/AuthTerminal.tsx`, `src/components/Header.tsx`, `src/components/Sidebar.tsx`, `src/components/FilterBar.tsx`, `src/components/BottomNav.tsx` e `src/components/Footer.tsx` 100% em PT-BR.
- **Critérios de Aceite:**
  - [x] Busca normalizada sem acentos (`normalize('NFD')`) verificando título, autor, nacionalidade original e categoria.
  - [x] Botão `[ X ]` para limpar a busca e estado vazio `NENHUM REGISTRO ENCONTRADO PARA A BUSCA ATUAL` + `[ LIMPAR FILTROS ]`.
  - [x] Nome real do operador, iniciais no avatar e botão `[ ENCERRAR SESSÃO ]` no cabeçalho e Sidebar.

---

### Issue #14 — Adicionar ranqueamento por nota e exportação JSON
- **Labels:** `feature`, `priority:medium`
- **Branch Git Flow:** `feature/issue-14-ranking-e-exportacao`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "feat(ranking): adicionar ranqueamento por nota e exportacao json (Closes #14)"
  ```
- **Marco SemVer ao concluir:** **`v0.3.0`** (`Release v0.3.0: Telemetria Dinamica, Busca Multicriterio, Filtros e Ranking`)
- **Descrição:** Implementar `src/components/RankingView.tsx` (`RANKING // CLASSIFICAÇÃO GERAL`) e a exportação de backup `.json`.
- **Critérios de Aceite:**
  - [x] Visão de Ranking ordenada por nota com destaque para `#01`, `#02` e `#03`.
  - [x] Download de arquivo `.json` com livros e categorias da conta autenticada.

---

### Issue #15 — Finalizar configuração PWA e documentação principal sincronizada
- **Labels:** `pwa`, `docs`, `priority:medium`
- **Branch Git Flow:** `feature/issue-15-pwa-e-readme`
- **Comando de Commit Atômico:**
  ```bash
  git commit -m "docs(readme): finalizar configuracao pwa e documentacao principal sincronizada (Closes #15)"
  ```
- **Marco SemVer ao concluir:** **`v1.0.0`** (`Release v1.0.0: Versao Estavel Completa do Librarytrix PWA`)
- **Descrição:** Integrar `index.html`, ícones PWA (`public/`), `src/main.tsx`, `src/App.tsx`, `scripts/` e `README.md`.
- **Critérios de Aceite:**
  - [x] Manifesto PWA e Service Worker gerados sem erros no build.
  - [x] `README.md` documentando setup, funcionalidades, links para `docs/` e fluxo Git Flow.
