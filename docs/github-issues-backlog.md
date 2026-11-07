# Backlog de Issues — GitHub (Git Flow + SemVer)

## Convenções
- **Branches (Git Flow):** `main` (produção/releases) · `develop` (integração) · `chore/issue-XX-*` · `docs/issue-XX-*` · `feature/issue-XX-*`.
- **Commits (Conventional Commits):** `chore(scope):`, `docs(scope):`, `feat(scope):` + rastreabilidade `(Closes #X)`.
- **SemVer (Tags Anotadas na `main`):**
  - `v0.1.0`: Documentação de Planejamento e Setup Inicial (Issues #1–#5)
  - `v0.2.0`: Core CRUD de Livros, Críticas de 1000 Caracteres e Categorias Customizadas (Issues #6–#10)
  - `v0.3.0`: Telemetria Dinâmica, Busca Multicritério, Filtros e Ranking (Issues #11–#14)
  - `v1.0.0`: Versão Estável Completa do Librarytrix PWA (Issue #15)
- **Labels:** `feature`, `design`, `data`, `pwa`, `docs`, `chore`, `priority:high`, `priority:medium`.

| # | Título | Labels | Branch | Commit Atômico | Marco SemVer |
|---|--------|--------|--------|----------------|--------------|
| 1 | Configurar dependências React, TypeScript e Vite | chore, priority:high | `chore/issue-01-setup-projeto` | `chore(setup): configurar dependencias react typescript e vite (Closes #1)` | `v0.1.0` |
| 2 | Elaborar Termo de Abertura do Projeto (Project Charter) | docs, priority:high | `docs/issue-02-project-charter` | `docs(charter): elaborar termo de abertura do projeto (Closes #2)` | `v0.1.0` |
| 3 | Especificar Requisitos Funcionais e Não Funcionais | docs, priority:high | `docs/issue-03-requisitos` | `docs(requisitos): especificar requisitos funcionais e nao funcionais (Closes #3)` | `v0.1.0` |
| 4 | Detalhar Casos de Uso e Diagramas Arquiteturais (C4/DER) | docs, priority:high | `docs/issue-04-casos-de-uso` | `docs(uc): detalhar casos de uso e diagramas arquiteturais (Closes #4)` | `v0.1.0` |
| 5 | Documentar User Stories em BDD/Gherkin e Backlog de Issues | docs, priority:high | `docs/issue-05-user-stories` | `docs(stories): documentar user stories em bdd e backlog de issues (Closes #5)` | `v0.1.0` |
| 6 | Implementar Design System Cyberpunk Terminal HUD | design, priority:high | `feature/issue-06-design-system-cyberpunk` | `feat(ui): implementar design system cyberpunk terminal hud (Closes #6)` | `v0.2.0` |
| 7 | Implementar serviço de persistência Firebase e storage local | data, priority:high | `feature/issue-07-tipos-e-persistencia` | `feat(db): implementar servico de persistencia firebase e storage local (Closes #7)` | `v0.2.0` |
| 8 | Implementar cadastro, edição e exclusão de livros | feature, priority:high | `feature/issue-08-crud-livros` | `feat(books): implementar cadastro edicao e exclusao de livros (Closes #8)` | `v0.2.0` |
| 9 | Aplicar limite de 1000 caracteres na crítica com contador em tempo real | feature, priority:high | `feature/issue-09-validacao-critica-1000-chars` | `feat(critique): aplicar limite de 1000 caracteres com contador em tempo real (Closes #9)` | `v0.2.0` |
| 10 | Implementar criação de categorias com cor Hexadecimal e exclusão | feature, priority:high | `feature/issue-10-gestao-categorias-hex` | `feat(categories): implementar criacao com cor hexadecimal e exclusao de categorias (Closes #10)` | `v0.2.0` |
| 11 | Construir grid de cards com avaliação HUD de 0 a 5 | feature, design, priority:high | `feature/issue-11-listagem-cards-hud` | `feat(catalog): construir grid de cards com avaliacao hud de 0 a 5 (Closes #11)` | `v0.3.0` |
| 12 | Implementar painel superior de telemetria com 4 métricas dinâmicas | feature, priority:medium | `feature/issue-12-telemetria-dinamica` | `feat(telemetry): implementar painel superior com 4 metricas dinamicas (Closes #12)` | `v0.3.0` |
| 13 | Implementar busca multicritério em 4 campos e filtros combinados em PT-BR | feature, priority:high | `feature/issue-13-filtros-e-busca-ptbr` | `feat(search): implementar busca multicriterio e filtros combinados em pt-br (Closes #13)` | `v0.3.0` |
| 14 | Adicionar ranqueamento por nota (Ranking) e exportação JSON | feature, priority:medium | `feature/issue-14-ranking-e-exportacao` | `feat(ranking): adicionar ranqueamento por nota e exportacao json (Closes #14)` | `v0.3.0` |
| 15 | Finalizar configuração PWA e documentação principal sincronizada | pwa, docs, priority:medium | `feature/issue-15-pwa-e-readme` | `docs(readme): finalizar configuracao pwa e documentacao principal sincronizada (Closes #15)` | `v1.0.0` |

---

## Detalhamento das Entregas e Critérios de Aceite

### Marco `v0.1.0` — Planejamento e Setup Inicial
- **#1 (`chore/issue-01-setup-projeto`):** `package.json`, `tsconfig.json`, `vite.config.ts`. Build TypeScript estrito e Vite configurados.
- **#2 (`docs/issue-02-project-charter`):** `docs/project-charter.md` com justificativa, objetivos SMART, escopo In/Out, stakeholders e riscos.
- **#3 (`docs/issue-03-requisitos`):** `docs/requisitos.md` com RF01–RF16 e RNF01–RNF12 rastreáveis.
- **#4 (`docs/issue-04-casos-de-uso`):** `docs/casos-de-uso.md` (UC01–UC09) e `docs/arquitetura-der.md` (diagramas Mermaid C4 e DER).
- **#5 (`docs/issue-05-user-stories`):** `docs/user-stories.md` (cenários BDD/Gherkin) e `docs/github-issues-backlog.md`.

### Marco `v0.2.0` — Core CRUD, Críticas de 1000 Caracteres e Categorias Customizadas
- **#6 (`feature/issue-06-design-system-cyberpunk`):** `DESIGN.md`, `tailwind.config.js`, `postcss.config.js`, `src/index.css` (geometria 0px, scanlines, glow neon phosphor).
- **#7 (`feature/issue-07-tipos-e-persistencia`):** `src/types/`, `src/utils.ts` e `src/services/` (`firebase.ts`, `seed.ts`, `storageService.ts` com 6 livros-semente em PT-BR).
- **#8 (`feature/issue-08-crud-livros`):** `Modal.tsx` e `NewBookModal.tsx` com validação de campos, `ID_ARQUIVO //` sequencial e exclusão com confirmação.
- **#9 (`feature/issue-09-validacao-critica-1000-chars`):** `CritiqueEditor.tsx` e `CritiqueModal.tsx` com `maxLength={1000}`, `CARACTERES: XXX / 1000` (amarelo > 900, magenta em 1000) e `[ VER CRÍTICA COMPLETA ]`.
- **#10 (`feature/issue-10-gestao-categorias-hex`):** `NewCategoryModal.tsx` (presets + código hexadecimal `/^#([0-9A-F]{3}){1,2}$/i` + `<input type="color">` + preview da etiqueta) e `ConfirmCategoryDelete.tsx` (reatribuição automática para `GERAL` `#849495`).

### Marco `v0.3.0` — Telemetria Dinâmica, Busca Multicritério, Filtros e Ranking
- **#11 (`feature/issue-11-listagem-cards-hud`):** `BookCard.tsx` e `RatingBar.tsx` (5 células segmentadas e cores inline dinâmicas por categoria).
- **#12 (`feature/issue-12-telemetria-dinamica`):** `TelemetryStrip.tsx` (`REGISTROS // TOTAL`, `MÉTRICA // GERAL` ou `[CATEGORIA]`, `ÚLTIMO REGISTRO // ADIÇÃO` e `DADOS // DOMINÂNCIA`).
- **#13 (`feature/issue-13-filtros-e-busca-ptbr`):** `Header.tsx`, `Sidebar.tsx`, `FilterBar.tsx`, `BottomNav.tsx` e `Footer.tsx` 100% em PT-BR com busca normalizada em 4 campos (título, autor, nacionalidade original e categoria) e botão `[ X ]`.
- **#14 (`feature/issue-14-ranking-e-exportacao`):** `RankingView.tsx` (`RANKING // CLASSIFICAÇÃO GERAL` com destaque `#01`–`#03`) e exportação de pacote `.json`.

### Marco `v1.0.0` — Versão Estável Completa do Librarytrix PWA
- **#15 (`feature/issue-15-pwa-e-readme`):** `index.html`, ícones PWA (`public/`), `src/main.tsx`, `src/App.tsx`, `scripts/create-issues.sh`, `scripts/setup-gitflow-history.sh` e `README.md`.
