#!/usr/bin/env bash
# Cria labels e as 15 Issues do backlog no GitHub usando o GitHub CLI (gh).
# Uso: gh auth login && ./scripts/create-issues.sh [owner/repo]
set -euo pipefail

REPO_ARG=()
if [[ "${1:-}" != "" ]]; then REPO_ARG=(--repo "$1"); fi

GH_BIN="gh"
if ! command -v gh >/dev/null 2>&1; then
  if [[ -x "/c/Program Files/GitHub CLI/gh.exe" ]]; then
    GH_BIN="/c/Program Files/GitHub CLI/gh.exe"
  else
    echo "GitHub CLI (gh) não encontrado."
    exit 1
  fi
fi

echo ">> Criando labels..."
label() { "$GH_BIN" label create "$1" --color "$2" --description "$3" --force "${REPO_ARG[@]}" >/dev/null; }
label feature "00f0ff" "Nova funcionalidade"
label design "a855f7" "Design System / UI"
label data "39ff14" "Persistência e dados"
label pwa "ffb800" "Progressive Web App"
label docs "849495" "Documentação"
label chore "3b494b" "Infra e manutenção"
label "priority:high" "ff007f" "Prioridade alta"
label "priority:medium" "ffb800" "Prioridade média"

issue() {
  local title="$1" labels="$2" body="$3"
  "$GH_BIN" issue create --title "$title" --label "$labels" --body "$body" "${REPO_ARG[@]}"
}

echo ">> Criando as 15 issues..."

issue "Issue #1: Configurar dependências React, TypeScript e Vite" "chore,priority:high" \
"Branch: \`chore/issue-01-setup-projeto\`
Commit: \`chore(setup): configurar dependencias react typescript e vite (Closes #1)\`
Marco SemVer: \`v0.1.0\`
Critérios: \`package.json\`, \`tsconfig.json\` e \`vite.config.ts\` configurados e compilando sem erros."

issue "Issue #2: Elaborar Termo de Abertura do Projeto (Project Charter)" "docs,priority:high" \
"Branch: \`docs/issue-02-project-charter\`
Commit: \`docs(charter): elaborar termo de abertura do projeto (Closes #2)\`
Marco SemVer: \`v0.1.0\`
Critérios: \`docs/project-charter.md\` com justificativa, objetivos SMART, escopo, stakeholders e riscos."

issue "Issue #3: Especificar Requisitos Funcionais e Não Funcionais" "docs,priority:high" \
"Branch: \`docs/issue-03-requisitos\`
Commit: \`docs(requisitos): especificar requisitos funcionais e nao funcionais (Closes #3)\`
Marco SemVer: \`v0.1.0\`
Critérios: \`docs/requisitos.md\` documentando RF01–RF16 e RNF01–RNF12."

issue "Issue #4: Detalhar Casos de Uso e Diagramas Arquiteturais" "docs,priority:high" \
"Branch: \`docs/issue-04-casos-de-uso\`
Commit: \`docs(uc): detalhar casos de uso e diagramas arquiteturais (Closes #4)\`
Marco SemVer: \`v0.1.0\`
Critérios: \`docs/casos-de-uso.md\` e \`docs/arquitetura-der.md\` com diagramas Mermaid C4 e DER."

issue "Issue #5: Documentar User Stories em BDD e Backlog de Issues" "docs,priority:high" \
"Branch: \`docs/issue-05-user-stories\`
Commit: \`docs(stories): documentar user stories em bdd e backlog de issues (Closes #5)\`
Marco SemVer: \`v0.1.0\`
Critérios: \`docs/user-stories.md\` (Gherkin) e \`docs/github-issues-backlog.md\`."

issue "Issue #6: Implementar Design System Cyberpunk Terminal HUD" "design,priority:high" \
"Branch: \`feature/issue-06-design-system-cyberpunk\`
Commit: \`feat(ui): implementar design system cyberpunk terminal hud (Closes #6)\`
Marco SemVer: \`v0.2.0\`
Critérios: \`DESIGN.md\`, \`tailwind.config.js\`, \`postcss.config.js\` e \`src/index.css\`."

issue "Issue #7: Implementar serviço de persistência Firebase e storage local" "data,priority:high" \
"Branch: \`feature/issue-07-tipos-e-persistencia\`
Commit: \`feat(db): implementar servico de persistencia firebase e storage local (Closes #7)\`
Marco SemVer: \`v0.2.0\`
Critérios: \`src/types/\`, \`src/utils.ts\` e \`src/services/\` com fallback \`localStorage\` e seed em PT-BR."

issue "Issue #8: Implementar cadastro, edição e exclusão de livros" "feature,priority:high" \
"Branch: \`feature/issue-08-crud-livros\`
Commit: \`feat(books): implementar cadastro edicao e exclusao de livros (Closes #8)\`
Marco SemVer: \`v0.2.0\`
Critérios: \`Modal.tsx\` e \`NewBookModal.tsx\` com validação e geração de \`ID_ARQUIVO //\`."

issue "Issue #9: Aplicar limite de 1000 caracteres na crítica com contador em tempo real" "feature,priority:high" \
"Branch: \`feature/issue-09-validacao-critica-1000-chars\`
Commit: \`feat(critique): aplicar limite de 1000 caracteres com contador em tempo real (Closes #9)\`
Marco SemVer: \`v0.2.0\`
Critérios: \`CritiqueEditor.tsx\` e \`CritiqueModal.tsx\` com \`maxLength={1000}\` e contador \`CARACTERES: XXX / 1000\`."

issue "Issue #10: Implementar criação com cor Hexadecimal e exclusão de categorias" "feature,priority:high" \
"Branch: \`feature/issue-10-gestao-categorias-hex\`
Commit: \`feat(categories): implementar criacao com cor hexadecimal e exclusao de categorias (Closes #10)\`
Marco SemVer: \`v0.2.0\`
Critérios: \`NewCategoryModal.tsx\` (input hexadecimal + color picker + preview) e \`ConfirmCategoryDelete.tsx\` (reatribuição para \`GERAL\`)."

issue "Issue #11: Construir grid de cards com avaliação HUD de 0 a 5" "feature,design,priority:high" \
"Branch: \`feature/issue-11-listagem-cards-hud\`
Commit: \`feat(catalog): construir grid de cards com avaliacao hud de 0 a 5 (Closes #11)\`
Marco SemVer: \`v0.3.0\`
Critérios: \`BookCard.tsx\` e \`RatingBar.tsx\` com barras de 5 células e cores dinâmicas."

issue "Issue #12: Implementar painel superior com 4 métricas dinâmicas" "feature,priority:medium" \
"Branch: \`feature/issue-12-telemetria-dinamica\`
Commit: \`feat(telemetry): implementar painel superior com 4 metricas dinamicas (Closes #12)\`
Marco SemVer: \`v0.3.0\`
Critérios: \`TelemetryStrip.tsx\` com total de registros, nota média dinâmica, último livro adicionado e categoria dominante."

issue "Issue #13: Implementar busca multicritério e filtros combinados em PT-BR" "feature,priority:high" \
"Branch: \`feature/issue-13-filtros-e-busca-ptbr\`
Commit: \`feat(search): implementar busca multicriterio e filtros combinados em pt-br (Closes #13)\`
Marco SemVer: \`v0.3.0\`
Critérios: \`Header.tsx\`, \`Sidebar.tsx\`, \`FilterBar.tsx\`, \`BottomNav.tsx\` e \`Footer.tsx\` em PT-BR com busca normalizada em 4 campos."

issue "Issue #14: Adicionar ranqueamento por nota e exportação JSON" "feature,priority:medium" \
"Branch: \`feature/issue-14-ranking-e-exportacao\`
Commit: \`feat(ranking): adicionar ranqueamento por nota e exportacao json (Closes #14)\`
Marco SemVer: \`v0.3.0\`
Critérios: \`RankingView.tsx\` (\`RANKING // CLASSIFICAÇÃO GERAL\`) e exportação \`.json\`."

issue "Issue #15: Finalizar configuração PWA e documentação principal sincronizada" "pwa,docs,priority:medium" \
"Branch: \`feature/issue-15-pwa-e-readme\`
Commit: \`docs(readme): finalizar configuracao pwa e documentacao principal sincronizada (Closes #15)\`
Marco SemVer: \`v1.0.0\`
Critérios: \`index.html\`, \`public/\`, \`src/main.tsx\`, \`src/App.tsx\`, \`scripts/\` e \`README.md\`."

echo ">> Concluído: 15 issues criadas."
