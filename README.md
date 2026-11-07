# LIBRARYTRIX // SISTEMA_ARQUIVO

![React](https://img.shields.io/badge/React-18-00f0ff?logo=react&logoColor=white&labelColor=0e0e12)
![TypeScript](https://img.shields.io/badge/TypeScript-5-39ff14?logo=typescript&logoColor=white&labelColor=0e0e12)
![Tailwind](https://img.shields.io/badge/Tailwind-3-a855f7?logo=tailwindcss&logoColor=white&labelColor=0e0e12)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-ffb800?logo=firebase&logoColor=white&labelColor=0e0e12)
![PWA](https://img.shields.io/badge/PWA-ready-ff007f?labelColor=0e0e12)
![Version](https://img.shields.io/badge/version-1.0.0-00f0ff?labelColor=0e0e12)

Catálogo de leitura e críticas em estilo **Terminal HUD cyberpunk** (100% em Português — PT-BR). PWA responsivo (desktop + mobile) com persistência em Firebase Firestore e **fallback automático em `localStorage`** — funciona imediatamente após clonar, sem configurar nada.

## Funcionalidades
- CRUD de livros (`ID_ARQUIVO // 0842-CYB`, nota 0.0–5.0, status, telemetryTag, crítica).
- Categorias dinâmicas com cor Neon Phosphor **ou código hexadecimal customizado** (seletor visual + preview da etiqueta) e sufixo de protocolo (`+ NOVA CATEGORIA`, `ALT+N`).
- **Exclusão de categorias** com confirmação `CONFIRMAR EXCLUSÃO`; livros vinculados são reatribuídos automaticamente à categoria `GERAL` (`#849495`).
- Nota HUD (`4.9 ★` + barra de 5 células) e **Ranking** (classificação geral).
- Filtros combinados (categoria, nota mínima, nacionalidade) + busca em tempo real (`BUSCAR >`, `CTRL+K`, botão `[ X ]`, insensível a acentos e caixa) por **título, autor, nacionalidade original ou categoria**.
- Ordenação: maior nota, crítica recente, ano de publicação, título A-Z.
- Terminal de crítica `TERMINAL DE CRÍTICA V4.0 // LIMITE: 1000 CARACTERES`: limite máximo de 1000 caracteres, contador `CARACTERES: XXX / 1000` (amarelo > 900, magenta em 1000), `CTRL+ENTER`.
- Telemetria em tempo real (`REGISTROS // TOTAL`, `MÉTRICA // GERAL` ou por Categoria, `ÚLTIMO REGISTRO // ADIÇÃO` e `DADOS // DOMINÂNCIA`) e exportação `.json` (`[ SALVAR PACOTE DE DADOS ]`).
- PWA instalável com suporte offline.

## Setup
```bash
git clone <url-do-repositorio> librarytrix
cd librarytrix
npm install
npm run dev        # http://localhost:5173
```
Build de produção: `npm run build` · Preview: `npm run preview` · Checagem de tipos: `npm run typecheck`.

### Firebase (opcional)
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e habilite o **Cloud Firestore**.
2. `cp .env.example .env` e preencha as variáveis `VITE_FIREBASE_*`.
3. Regras de desenvolvimento do Firestore (ajuste para produção):
   ```
   rules_version = '2';
   service cloud.firestore { match /databases/{db}/documents { match /{document=**} { allow read, write: if true; } } }
   ```
Sem `.env`, o app usa `localStorage` pré-carregado com *Neuromancer*, *Duna*, *1984*, *O Mito de Sísifo*, *Snow Crash* e *Sapiens*.

## Estrutura
```text
librarytrix/
├── docs/                 # Documentação acadêmica
├── scripts/create-issues.sh
├── src/
│   ├── components/       # Header, Sidebar, TelemetryStrip, FilterBar, BookCard, ...
│   ├── services/         # firebase.ts, storageService.ts, seed.ts
│   ├── types/            # Book, Category, FilterState
│   ├── App.tsx · main.tsx · index.css
├── DESIGN.md             # Design System "Librarytrix Terminal HUD"
├── .env.example
└── README.md
```

## Documentação (`docs/`)
| Documento | Conteúdo |
|-----------|----------|
| [project-charter.md](docs/project-charter.md) | Termo de Abertura |
| [requisitos.md](docs/requisitos.md) | RF01–RF16 e RNF01–RNF12 |
| [casos-de-uso.md](docs/casos-de-uso.md) | Casos de uso |
| [user-stories.md](docs/user-stories.md) | Histórias + BDD/Gherkin |
| [arquitetura-der.md](docs/arquitetura-der.md) | C4, DER e fluxo de telas (Mermaid) |
| [github-issues-backlog.md](docs/github-issues-backlog.md) | 15 Issues, Git Flow, SemVer |

Protótipos de referência: [`docs/prototype-desktop.html`](docs/prototype-desktop.html) e [`docs/prototype-mobile.html`](docs/prototype-mobile.html).

## Git Flow e Issues
- Branches: `main` · `develop` · `feature/<n>-<slug>` · `release/x.y.z` · `hotfix/x.y.z`.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:` ... `(#issue)`).
- Versionamento: [SemVer](https://semver.org/lang/pt-BR/).
- Criar as 15 Issues e labels: `gh auth login && bash scripts/create-issues.sh owner/repo`.

## Atalhos
| Atalho | Ação |
|--------|------|
| `CTRL+K` / `⌘K` | Focar `BUSCAR >` |
| `ALT+N` | Nova categoria |
| `CTRL+ENTER` | Submeter crítica |

## Licença
MIT

