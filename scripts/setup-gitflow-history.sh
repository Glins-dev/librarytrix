#!/usr/bin/env bash
# ==============================================================================
# Librarytrix — Automação Completa do Fluxo Git Flow, 15 Issues, Commits Atômicos e SemVer
# ==============================================================================
set -euo pipefail

REMOTE_URL="${1:-https://github.com/Glins-dev/librarytrix.git}"

echo ">> [1/5] Reinicializando repositório Git limpo..."
rm -rf .git
git init -b main
git config user.name "Glins-dev"
git config user.email "guilhermelins.dev@gmail.com"

# Commit inicial na main
git add .gitignore .env.example
git commit -m "chore(setup): inicializar estrutura base do repositorio (#1)"

# Criar branch develop a partir da main
git checkout -b develop

# Função auxiliar para criar branch temática a partir da develop, commitar e fazer merge --no-ff
run_issue_branch() {
  local branch="$1"
  local msg="$2"
  shift 2
  git checkout -b "$branch" develop
  git add "$@"
  git commit -m "$msg"
  git checkout develop
  git merge --no-ff "$branch" -m "Merge branch '$branch' into develop"
}

echo ">> [2/5] Executando Bloco 1 (Issues #1 a #5) -> Release v0.1.0..."

run_issue_branch "chore/issue-01-setup-projeto" \
  "chore(setup): configurar dependencias react typescript e vite (Closes #1)" \
  package.json package-lock.json tsconfig.json vite.config.ts

run_issue_branch "docs/issue-02-project-charter" \
  "docs(charter): elaborar termo de abertura do projeto (Closes #2)" \
  docs/project-charter.md

run_issue_branch "docs/issue-03-requisitos" \
  "docs(requisitos): especificar requisitos funcionais e nao funcionais (Closes #3)" \
  docs/requisitos.md

run_issue_branch "docs/issue-04-casos-de-uso" \
  "docs(uc): detalhar casos de uso e diagramas arquiteturais (Closes #4)" \
  docs/casos-de-uso.md docs/arquitetura-der.md

run_issue_branch "docs/issue-05-user-stories" \
  "docs(stories): documentar user stories em bdd e backlog de issues (Closes #5)" \
  docs/user-stories.md docs/github-issues-backlog.md

# Marco SemVer 1: v0.1.0
git checkout main
git merge --no-ff develop -m "Merge branch 'develop' into main (Release v0.1.0)"
git tag -a v0.1.0 -m "Release v0.1.0: Documentacao de Planejamento e Setup Inicial"
git checkout develop

echo ">> [3/5] Executando Bloco 2 (Issues #6 a #10) -> Release v0.2.0..."

run_issue_branch "feature/issue-06-design-system-cyberpunk" \
  "feat(ui): implementar design system cyberpunk terminal hud (Closes #6)" \
  DESIGN.md tailwind.config.js postcss.config.js src/index.css docs/prototype-desktop.html docs/prototype-mobile.html code.html code_desktop.html

run_issue_branch "feature/issue-07-tipos-e-persistencia" \
  "feat(db): implementar servico de persistencia firebase e storage local (Closes #7)" \
  src/types/ src/utils.ts src/services/ firestore.rules

run_issue_branch "feature/issue-08-crud-livros" \
  "feat(books): implementar cadastro edicao e exclusao de livros (Closes #8)" \
  src/components/Modal.tsx src/components/NewBookModal.tsx

run_issue_branch "feature/issue-09-validacao-critica-1000-chars" \
  "feat(critique): aplicar limite de 1000 caracteres com contador em tempo real (Closes #9)" \
  src/components/CritiqueEditor.tsx src/components/CritiqueModal.tsx

run_issue_branch "feature/issue-10-gestao-categorias-hex" \
  "feat(categories): implementar criacao com cor hexadecimal e exclusao de categorias (Closes #10)" \
  src/components/NewCategoryModal.tsx src/components/ConfirmCategoryDelete.tsx

# Marco SemVer 2: v0.2.0
git checkout main
git merge --no-ff develop -m "Merge branch 'develop' into main (Release v0.2.0)"
git tag -a v0.2.0 -m "Release v0.2.0: Core CRUD de Livros, Criticas de 1000 Caracteres e Categorias Customizadas"
git checkout develop

echo ">> [4/5] Executando Bloco 3 (Issues #11 a #14) -> Release v0.3.0..."

run_issue_branch "feature/issue-11-listagem-cards-hud" \
  "feat(catalog): construir grid de cards com avaliacao hud de 0 a 5 (Closes #11)" \
  src/components/RatingBar.tsx src/components/BookCard.tsx

run_issue_branch "feature/issue-12-telemetria-dinamica" \
  "feat(telemetry): implementar painel superior com 4 metricas dinamicas (Closes #12)" \
  src/components/TelemetryStrip.tsx

run_issue_branch "feature/issue-13-filtros-e-busca-ptbr" \
  "feat(search): implementar busca multicriterio e filtros combinados em pt-br (Closes #13)" \
  src/components/AuthTerminal.tsx src/components/Header.tsx src/components/Sidebar.tsx src/components/FilterBar.tsx src/components/BottomNav.tsx src/components/Footer.tsx

run_issue_branch "feature/issue-14-ranking-e-exportacao" \
  "feat(ranking): adicionar ranqueamento por nota e exportacao json (Closes #14)" \
  src/components/RankingView.tsx

# Marco SemVer 3: v0.3.0
git checkout main
git merge --no-ff develop -m "Merge branch 'develop' into main (Release v0.3.0)"
git tag -a v0.3.0 -m "Release v0.3.0: Telemetria Dinamica, Busca Multicriterio, Filtros e Ranking"
git checkout develop

echo ">> [5/5] Executando Bloco Final (Issue #15) -> Release v1.0.0..."

run_issue_branch "feature/issue-15-pwa-e-readme" \
  "docs(readme): finalizar configuracao pwa e documentacao principal sincronizada (Closes #15)" \
  index.html public/ src/main.tsx src/App.tsx scripts/ README.md

# Marco SemVer Final: v1.0.0
git checkout main
git merge --no-ff develop -m "Merge branch 'develop' into main (Release v1.0.0)"
git tag -a v1.0.0 -m "Release v1.0.0: Versao Estavel Completa do Librarytrix PWA"

git remote add origin "$REMOTE_URL"
echo ">> Fluxo Git Flow local concluído com sucesso! Tags criadas:"
git tag -l -n1
