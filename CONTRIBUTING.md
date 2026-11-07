# Guia de Contribuição — Librarytrix

Obrigado pelo interesse em contribuir com o **Librarytrix (`SISTEMA_ARQUIVO // DB-01`)**! Este documento define o fluxo de trabalho de Engenharia de Software adotado pelo repositório (Git Flow, Commits Semânticos, Pull Requests e Qualidade de Testes).

---

## 1. Fluxo de Branches (Git Flow)

O repositório adota estritamente o modelo **Git Flow**:

- `main`: Branch de produção estável. Contém exclusivamente merges vindos da `develop` acompanhados de tags anotadas SemVer (`v0.1.0`, `v1.0.0`, `v1.1.1`, `v1.2.0`). **Nunca faça commits diretos na `main`.**
- `develop`: Branch de integração contínua onde todas as branches temáticas convergem via Pull Request.
- **Branches Temáticas (criadas a partir da `develop`):**
  - `feature/issue-XX-descricao`: Novas funcionalidades de produto (`RF01`–`RF15`).
  - `sec/issue-XX-descricao`: Evoluções de segurança, criptografia (`PBKDF2`) e regras Firestore (`firestore.rules`).
  - `test/issue-XX-descricao`: Expansão da suíte de testes automatizados (Vitest).
  - `docs/issue-XX-descricao`: Atualizações de documentação técnica, diagramas C4/DER e evidências.
  - `fix/issue-XX-descricao`: Correções de bugs em desenvolvimento.

### Passo a passo para criar uma contribuição:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/issue-XX-minha-entrega
```

---

## 2. Padrão de Commits (Conventional Commits)

Todos os commits devem ser atômicos, redigidos em português e seguir o padrão **Conventional Commits** referenciando a Issue correspondente:

```text
<tipo>(<escopo>): <descrição concisa no infinitivo> (#XX)
```

- **Tipos permitidos:** `feat`, `fix`, `sec`, `test`, `docs`, `refactor`, `chore`, `ci`.
- **Exemplos válidos:**
  - `feat(critique): implementar editor de critica com limite de 1000 caracteres (Closes #8)`
  - `sec(auth): migrar KDF local para PBKDF2 210k iteracoes (#3)`
  - `test(storage): adicionar suite unitaria vitest para isolamento por uid (#1)`

---

## 3. Execução Local e Validação Obrigatória antes do Pull Request

Antes de abrir um Pull Request para a branch `develop`, execute obrigatoriamente:

```bash
# 1. Instalar dependências
npm install --legacy-peer-deps

# 2. Executar a suíte completa de testes unitários e de segurança (Vitest)
npm test

# 3. Validar tipagem TypeScript (tsc -b) e build de produção + Service Worker PWA
npm run build
```

Nenhum Pull Request deve ser mergeado se o workflow **Librarytrix CI** (`.github/workflows/ci.yml`) apresentar falha.

---

## 4. Regra de Sincronização Código ↔ Documentação

Qualquer alteração que modifique:
1. **Requisitos Funcionais ou Não Funcionais** deve atualizar simultaneamente `docs/requisitos.md`, `docs/casos-de-uso.md`, `docs/user-stories.md` e a Matriz de Rastreabilidade no `README.md`.
2. **Modelo de Dados ou Segurança (`Book`, `Category`, `OperatorUser`, `firestore.rules`)** deve atualizar `docs/arquitetura-der.md` e os testes em `src/services/__tests__/`.
