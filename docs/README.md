# Índice da Documentação de Engenharia — Librarytrix (`v1.2.0`)

Este diretório centraliza todos os artefatos formais de Engenharia de Software, Arquitetura, Segurança e Evidências de Qualidade do projeto **Librarytrix**.

---

## 1. Artefatos de Engenharia e Arquitetura

| Artefato | Versão Sincronizada | Escopo e Conteúdo Principal |
| :--- | :---: | :--- |
| [project-charter.md](./project-charter.md) | `v1.2.0` | Termo de Abertura (Project Charter), justificativa, visão geral, **5 Objetivos SMART**, escopo (In/Out) e matriz de Stakeholders. |
| [requisitos.md](./requisitos.md) | `v1.2.0` | Especificação completa e rastreável de **15 Requisitos Funcionais (`RF01`–`RF15`)** e **10 Requisitos Não Funcionais (`RNF01`–`RNF10`)** com vínculos diretos para os arquivos de teste automatizado. |
| [casos-de-uso.md](./casos-de-uso.md) | `v1.2.0` | Especificação formal de Casos de Uso (`UC01` a `UC04`) cobrindo Autenticação Multiusuário, Cadastro de Livro com Crítica de 1000 caracteres, Gestão de Categorias Hexadecimais e Busca Multicritério. |
| [user-stories.md](./user-stories.md) | `v1.2.0` | **8 Histórias de Usuário (`US01`–`US08`)** no formato canônico acompanhadas de Critérios de Aceite em **BDD / Gherkin** (*Dado / Quando / Então*). |
| [arquitetura-der.md](./arquitetura-der.md) | `v1.2.0` | Diagrama Entidade-Relacionamento (**DER** com `USER`, `CATEGORY`, `BOOK`), **Diagramas C4** (Contexto, Contêineres e Componentes React), Diagrama de Sequência e documentação de segurança (`PBKDF2` 210k iterações + `firestore.rules`). |
| [github-issues-backlog.md](./github-issues-backlog.md) | `v1.2.0` | Backlog estruturado em 4 Milestones e 15 Issues técnicas com critérios de aceite e rastreabilidade SemVer. |

---

## 2. Evidências de Qualidade, PWA e Acessibilidade

| Relatório de Evidência | Escopo Auditado |
| :--- | :--- |
| [evidencias/pwa-auditoria.md](./evidencias/pwa-auditoria.md) | Verificação técnica de instalabilidade PWA, `manifest.json`, Service Worker (`sw.js` / Workbox precache de 11 entradas) e operação 100% offline. |
| [evidencias/a11y-auditoria.md](./evidencias/a11y-auditoria.md) | Auditoria de acessibilidade WCAG 2.1 (contraste de cores no tema escuro HUD `#08080C`, semântica ARIA, labels de formulário e testes automatizados em `src/components/__tests__/a11y.test.tsx`). |

---

## 3. Regra de Sincronização Documentação ↔ Código

Para evitar deriva entre implementação e documentação ao longo das releases:
1. Toda nova feature ou alteração de requisito exige atualização no mesmo Pull Request do documento correspondente em `docs/` e da **Matriz de Rastreabilidade** em [`../README.md`](../README.md).
2. Mudanças em autenticação (`src/services/authService.ts`) ou regras de banco (`firestore.rules`) devem ser refletidas imediatamente em [`arquitetura-der.md`](./arquitetura-der.md) e validadas pela suíte `npm test`.
