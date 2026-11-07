#!/usr/bin/env bash
# ==============================================================================
# Librarytrix — Script Automatizado de Criação das Labels e das 15 Issues (GitHub CLI)
# Uso:
#   gh auth login
#   bash scripts/create-issues.sh [owner/repo]
# ==============================================================================
set -euo pipefail

REPO_ARG=()
if [[ "${1:-}" != "" ]]; then
  REPO_ARG=(--repo "$1")
fi

GH_BIN="gh"
if ! command -v gh >/dev/null 2>&1; then
  if [[ -x "/c/Program Files/GitHub CLI/gh.exe" ]]; then
    GH_BIN="/c/Program Files/GitHub CLI/gh.exe"
  else
    echo "ERRO: GitHub CLI (gh) não encontrado. Instale com: winget install --id GitHub.cli -e"
    exit 1
  fi
fi

echo ">> [1/2] Criando/atualizando labels padronizadas no repositório..."
create_label() {
  local name="$1" color="$2" desc="$3"
  "$GH_BIN" label create "$name" --color "$color" --description "$desc" --force "${REPO_ARG[@]}" >/dev/null
}

create_label "feature"         "00f0ff" "Nova funcionalidade do sistema"
create_label "design"          "a855f7" "Design System Cyberpunk Terminal HUD / UI"
create_label "data"            "39ff14" "Persistência, autenticação e banco de dados"
create_label "pwa"             "ffb800" "Progressive Web App e cache offline"
create_label "docs"            "849495" "Documentação de Engenharia de Software"
create_label "chore"           "3b494b" "Configuração de ambiente e infraestrutura"
create_label "priority:high"   "ff007f" "Prioridade alta (caminho crítico)"
create_label "priority:medium" "ffb800" "Prioridade média"

create_issue() {
  local title="$1" labels="$2" body="$3"
  "$GH_BIN" issue create --title "$title" --label "$labels" --body "$body" "${REPO_ARG[@]}"
}

echo ">> [2/2] Criando as 15 Issues rastreáveis do backlog..."

create_issue "Issue #1: Configurar dependências React, TypeScript e Vite" "chore,priority:high" \
"## Descrição
Configurar a estrutura base do projeto Librarytrix utilizando React 18, TypeScript 5 em modo estrito e Vite.

- **Branch Git Flow:** \`chore/issue-01-setup-projeto\`
- **Commit Atômico:** \`chore(setup): configurar dependencias react typescript e vite (Closes #1)\`
- **Marco SemVer:** \`v0.1.0\`

## Critérios de Aceite
- [x] \`package.json\`, \`tsconfig.json\` e \`vite.config.ts\` configurados.
- [x] \`.gitignore\` e \`.env.example\` versionados na raiz.
- [x] \`npm run build\` executando sem erros."

create_issue "Issue #2: Elaborar Termo de Abertura do Projeto (Project Charter)" "docs,priority:high" \
"## Descrição
Elaborar o Termo de Abertura em \`docs/project-charter.md\` contendo justificativa, visão geral, 5 Objetivos SMART, escopo In/Out e Stakeholders.

- **Branch Git Flow:** \`docs/issue-02-project-charter\`
- **Commit Atômico:** \`docs(charter): elaborar termo de abertura do projeto (Closes #2)\`
- **Marco SemVer:** \`v0.1.0\`

## Critérios de Aceite
- [x] Justificativa e visão geral documentadas em PT-BR.
- [x] 5 Objetivos SMART especificados em tabela.
- [x] Escopo preliminar (dentro e fora) e tabela de Stakeholders/público-alvo."

create_issue "Issue #3: Especificar Requisitos Funcionais e Não Funcionais" "docs,priority:high" \
"## Descrição
Documentar em \`docs/requisitos.md\` a lista numerada e rastreável de Requisitos Funcionais (\`[RF01]\` a \`[RF15]\`) e Não Funcionais (\`[RNF01]\` a \`[RNF10]\`).

- **Branch Git Flow:** \`docs/issue-03-requisitos\`
- **Commit Atômico:** \`docs(requisitos): especificar requisitos funcionais e nao funcionais (Closes #3)\`
- **Marco SemVer:** \`v0.1.0\`

## Critérios de Aceite
- [x] \`[RF01]\` a \`[RF15]\` cobrindo autenticação multiusuário, isolamento, CRUD, crítica 1000 chars, categorias hex, telemetria, busca 4 campos e exportação JSON.
- [x] \`[RNF01]\` a \`[RNF10]\` cobrindo React/Tailwind, Firebase Auth/Firestore, \`firestore.rules\`, PWA, desempenho e portabilidade.
- [x] Matriz de rastreabilidade horizontal incluída."

create_issue "Issue #4: Detalhar Casos de Uso e Diagramas Arquiteturais" "docs,priority:high" \
"## Descrição
Especificar em \`docs/casos-de-uso.md\` os atores e fluxos formais (principal, alternativo e exceção) e em \`docs/arquitetura-der.md\` os diagramas Mermaid (DER com User, Book e Category + C4).

- **Branch Git Flow:** \`docs/issue-04-casos-de-uso\`
- **Commit Atômico:** \`docs(uc): detalhar casos de uso e diagramas arquiteturais (Closes #4)\`
- **Marco SemVer:** \`v0.1.0\`

## Critérios de Aceite
- [x] Casos de uso formais para Autenticação, Cadastro de Livro com Crítica de 1000 chars, Categorias Hex e Busca Multicritério.
- [x] Diagrama DER em Mermaid contemplando \`USER\`, \`CATEGORY\` e \`BOOK\`."

create_issue "Issue #5: Documentar User Stories em BDD e Backlog de Issues" "docs,priority:high" \
"## Descrição
Redigir \`docs/user-stories.md\` no padrão canônico com critérios BDD/Gherkin e detalhar as 15 Issues em \`docs/github-issues-backlog.md\`.

- **Branch Git Flow:** \`docs/issue-05-user-stories\`
- **Commit Atômico:** \`docs(stories): documentar user stories em bdd e backlog de issues (Closes #5)\`
- **Marco SemVer:** \`v0.1.0\`

## Critérios de Aceite
- [x] User Stories no formato 'Como [ator], quero [ação] para que [valor de negócio]'.
- [x] Cenários BDD/Gherkin (\`Dado... Quando... Então...\`) explícitos."

create_issue "Issue #6: Implementar Design System Cyberpunk Terminal HUD" "design,priority:high" \
"## Descrição
Implementar os tokens visuais do \`DESIGN.md\` em \`tailwind.config.js\`, \`postcss.config.js\` e \`src/index.css\`.

- **Branch Git Flow:** \`feature/issue-06-design-system-cyberpunk\`
- **Commit Atômico:** \`feat(ui): implementar design system cyberpunk terminal hud (Closes #6)\`
- **Marco SemVer:** \`v0.2.0\`

## Critérios de Aceite
- [x] Paleta obsidiana (\`#08080C\`, \`#0D0E15\`), scanlines, glow neon phosphor e geometria \`0px\`.
- [x] Fontes \`Space Grotesk\` e \`JetBrains Mono\` configuradas."

create_issue "Issue #7: Implementar serviço de persistência Firebase, Auth e storage local isolado" "data,priority:high" \
"## Descrição
Implementar \`authService.ts\`, \`storageService.ts\`, \`firebase.ts\`, \`seed.ts\` e \`firestore.rules\` com isolamento por conta (\`uid\`).

- **Branch Git Flow:** \`feature/issue-07-tipos-e-persistencia\`
- **Commit Atômico:** \`feat(db): implementar servico de persistencia firebase e storage local (Closes #7)\`
- **Marco SemVer:** \`v0.2.0\`

## Critérios de Aceite
- [x] Firebase Auth com fallback local seguro usando \`SHA-256\` + salt via Web Crypto API.
- [x] Isolamento em \`users/{uid}/books\`, \`users/{uid}/categories\` e \`librarytrix_books_\${uid}\`.
- [x] Regras \`firestore.rules\` validando \`request.auth.uid == userId\` e \`critique.size() <= 1000\`."

create_issue "Issue #8: Implementar cadastro, edição e exclusão de livros" "feature,priority:high" \
"## Descrição
Construir os modais e operações de criação, edição e exclusão de livros (\`Modal.tsx\` e \`NewBookModal.tsx\`).

- **Branch Git Flow:** \`feature/issue-08-crud-livros\`
- **Commit Atômico:** \`feat(books): implementar cadastro edicao e exclusao de livros (Closes #8)\`
- **Marco SemVer:** \`v0.2.0\`

## Critérios de Aceite
- [x] Geração sequencial de \`ID_ARQUIVO // NNNN-SUF\`.
- [x] Validação de campos obrigatórios e nota decimal entre \`0.0\` e \`5.0\`."

create_issue "Issue #9: Aplicar limite de 1000 caracteres na crítica com contador em tempo real" "feature,priority:high" \
"## Descrição
Implementar \`CritiqueEditor.tsx\` e \`CritiqueModal.tsx\` aplicando limite estrito de 1000 caracteres na crítica literária.

- **Branch Git Flow:** \`feature/issue-09-validacao-critica-1000-chars\`
- **Commit Atômico:** \`feat(critique): aplicar limite de 1000 caracteres com contador em tempo real (Closes #9)\`
- **Marco SemVer:** \`v0.2.0\`

## Critérios de Aceite
- [x] \`maxLength={1000}\` e validação \`critique.length <= 1000\`.
- [x] Contador \`CARACTERES: XXX / 1000\` (amarelo \`#ffb800\` > 900; magenta \`#ff007f\` em 1000).
- [x] Visualização no modal \`[ VER CRÍTICA COMPLETA ]\`."

create_issue "Issue #10: Implementar criação com cor Hexadecimal e exclusão de categorias" "feature,priority:high" \
"## Descrição
Implementar \`NewCategoryModal.tsx\` com input de código hexadecimal customizado e \`ConfirmCategoryDelete.tsx\` para exclusão segura.

- **Branch Git Flow:** \`feature/issue-10-gestao-categorias-hex\`
- **Commit Atômico:** \`feat(categories): implementar criacao com cor hexadecimal e exclusao de categorias (Closes #10)\`
- **Marco SemVer:** \`v0.2.0\`

## Critérios de Aceite
- [x] Campo de texto hexadecimal (\`/^#([0-9A-F]{3}){1,2}\$/i\`) sincronizado com \`<input type=\"color\">\` e preview da etiqueta.
- [x] Exclusão de categorias reatribuindo livros vinculados automaticamente para \`GERAL\` (\`#849495\`)."

create_issue "Issue #11: Construir grid de cards com avaliação HUD de 0 a 5" "feature,design,priority:high" \
"## Descrição
Implementar \`BookCard.tsx\` e \`RatingBar.tsx\` com barra segmentada de 5 células e cores aplicadas via \`style\` inline.

- **Branch Git Flow:** \`feature/issue-11-listagem-cards-hud\`
- **Commit Atômico:** \`feat(catalog): construir grid de cards com avaliacao hud de 0 a 5 (Closes #11)\`
- **Marco SemVer:** \`v0.3.0\`

## Critérios de Aceite
- [x] Exibição da nota \`N.N ★\` e barra de 5 células proporcional.
- [x] Estilização dinâmica com a cor hexadecimal da categoria do livro."

create_issue "Issue #12: Implementar painel superior com 4 métricas dinâmicas" "feature,priority:medium" \
"## Descrição
Refatorar \`TelemetryStrip.tsx\` para calcular em tempo real os 4 blocos superiores de telemetria (Desktop e Mobile).

- **Branch Git Flow:** \`feature/issue-12-telemetria-dinamica\`
- **Commit Atômico:** \`feat(telemetry): implementar painel superior com 4 metricas dinamicas (Closes #12)\`
- **Marco SemVer:** \`v0.3.0\`

## Critérios de Aceite
- [x] Bloco 1: \`REGISTROS // TOTAL\` (\`SIS:ATIVO\`).
- [x] Bloco 2: \`MÉTRICA // GERAL\` ou \`MÉTRICA // [CATEGORIA]\` com cor dinâmica da categoria selecionada.
- [x] Bloco 3: \`ÚLTIMO REGISTRO // ADIÇÃO\` com título, autor e nota do último livro cadastrado.
- [x] Bloco 4: \`DADOS // DOMINÂNCIA\` (\`MAIOR CATEGORIA\`) com nome, percentual e cor da categoria líder."

create_issue "Issue #13: Implementar busca multicritério e filtros combinados em PT-BR" "feature,priority:high" \
"## Descrição
Implementar \`AuthTerminal.tsx\`, \`Header.tsx\`, \`Sidebar.tsx\`, \`FilterBar.tsx\`, \`BottomNav.tsx\` e \`Footer.tsx\` 100% em PT-BR com busca em 4 campos.

- **Branch Git Flow:** \`feature/issue-13-filtros-e-busca-ptbr\`
- **Commit Atômico:** \`feat(search): implementar busca multicriterio e filtros combinados em pt-br (Closes #13)\`
- **Marco SemVer:** \`v0.3.0\`

## Critérios de Aceite
- [x] Busca insensível a acentos (\`normalize('NFD')\`) por título, autor, nacionalidade original e categoria.
- [x] Botão \`[ X ]\` para limpar busca e estado vazio com \`[ LIMPAR FILTROS ]\`.
- [x] Identificação do operador logado e botão \`[ ENCERRAR SESSÃO ]\`."

create_issue "Issue #14: Adicionar ranqueamento por nota e exportação JSON" "feature,priority:medium" \
"## Descrição
Implementar \`RankingView.tsx\` (\`RANKING // CLASSIFICAÇÃO GERAL\`) e a função \`exportJson\` para backup do acervo.

- **Branch Git Flow:** \`feature/issue-14-ranking-e-exportacao\`
- **Commit Atômico:** \`feat(ranking): adicionar ranqueamento por nota e exportacao json (Closes #14)\`
- **Marco SemVer:** \`v0.3.0\`

## Critérios de Aceite
- [x] Ranking ordenado por nota destacando \`#01\`, \`#02\` e \`#03\`.
- [x] Exportação de pacote de dados \`.json\`."

create_issue "Issue #15: Finalizar configuração PWA e documentação principal sincronizada" "pwa,docs,priority:medium" \
"## Descrição
Finalizar a configuração PWA (\`index.html\`, \`public/\`), \`App.tsx\`, scripts de automação e o \`README.md\` na raiz.

- **Branch Git Flow:** \`feature/issue-15-pwa-e-readme\`
- **Commit Atômico:** \`docs(readme): finalizar configuracao pwa e documentacao principal sincronizada (Closes #15)\`
- **Marco SemVer:** \`v1.0.0\`

## Critérios de Aceite
- [x] Manifesto PWA e Service Worker gerados no build.
- [x] \`README.md\` exemplar com badges, instruções, links para \`docs/\` e tabela Git Flow."

echo ">> Concluído: 15 Issues criadas com sucesso!"
