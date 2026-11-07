# Arquitetura de Software e Diagrama Entidade-Relacionamento (DER) — Librarytrix

---

## 1. Modelo Entidade-Relacionamento (DER)

O modelo de dados do **Librarytrix** é estruturado em torno do isolamento multiusuário: cada **Operador (`USER`)** possui seu próprio conjunto exclusivo de **Categorias (`CATEGORY`)** e **Livros (`BOOK`)**. No **Cloud Firestore**, esse relacionamento `1:N` é materializado através das subcoleções hierárquicas `/users/{uid}/categories/{categoryId}` e `/users/{uid}/books/{bookId}` protegidas por `firestore.rules`. No modo **Offline-First (`localStorage`)**, o isolamento é garantido pelo particionamento de chaves `librarytrix_categories_${uid}` e `librarytrix_books_${uid}`.

```mermaid
erDiagram
  USER ||--o{ CATEGORY : "possui (1:N)"
  USER ||--o{ BOOK : "cataloga (1:N)"
  CATEGORY ||--o{ BOOK : "classifica (1:N)"

  USER {
    string uid PK "Identificador único do Operador (Firebase UID ou op_hex)"
    string email UK "Endereço de e-mail único (normalizado em minúsculas)"
    string displayName "Nome de Operador / Codinome exibido no HUD"
    string salt "Salt criptográfico de 16 bytes (modo local)"
    string passwordHash "Hash SHA-256 + salt (modo local) ou gerenciado pelo Firebase Auth"
    string createdAt "Timestamp ISO-8601 de criação da conta"
  }

  CATEGORY {
    string id PK "Slug identificador da categoria (ex.: cyberpunk, geral)"
    string userId FK "Referência ao proprietário (USER.uid)"
    string name "Nome de exibição da categoria (ex.: Cyberpunk, GERAL)"
    string color "Código hexadecimal validado (/^#([0-9A-F]{3}){1,2}$/i)"
    string suffix "Sufixo de protocolo de 2 a 4 letras (ex.: CYB, SCI, GER)"
  }

  BOOK {
    string id PK "Protocolo sequencial (ex.: ID_ARQUIVO // 0842-CYB)"
    string userId FK "Referência ao proprietário (USER.uid)"
    string title "Título da obra literária"
    string author "Nome do(a) autor(a)"
    string category FK "Nome da categoria vinculada (CATEGORY.name)"
    number releaseYear "Ano de publicação original"
    string originalNationality "País/Nacionalidade original em PT-BR (ex.: BRASIL, EUA, REINO UNIDO)"
    string coverUrl "URL da capa da obra"
    number rating "Nota numérica decimal de 0.0 a 5.0"
    string status "CRITICADO | ARQUIVADO | LENDO | PENDENTE"
    string telemetryTag "Tag técnica de indexação HUD"
    string critique "Crítica literária com limite estrito de 1000 caracteres"
    string syncDate "Data ISO-8601 do último registro/atualização"
  }
```

### Regras de Integridade do Modelo de Dados
1. **Isolamento por Proprietário (`userId`):** Nenhuma consulta ou gravação pode atravessar a fronteira de `USER.uid`. Validado no servidor por `isOwner(userId)` em `firestore.rules`.
2. **Integridade Referencial na Exclusão de Categoria:** Quando uma `CATEGORY` é excluída pelo operador, todos os registros `BOOK` cujo campo `category` aponta para `CATEGORY.name` são migrados atomicamente para a categoria padrão protegida `GERAL` (`color: #849495`, `suffix: GER`).
3. **Restrição de Domínio da Crítica Literária:** `BOOK.critique` possui comprimento máximo estrito de **1000 caracteres** (`critique.length <= 1000` no cliente e `data.critique.size() <= 1000` no `firestore.rules`).

---

## 2. Arquitetura C4 — Nível 1: Diagrama de Contexto

```mermaid
flowchart LR
  Op(["Operador / Leitor (Browser Desktop ou Mobile)"])
  Sys["Librarytrix PWA (SISTEMA_ARQUIVO // DB-01)"]
  FbAuth[("Firebase Authentication (Provedor JWT em Nuvem)")]
  FbStore[("Cloud Firestore (Banco NoSQL Isolado por UID)")]

  Op -->|"Autentica, cataloga livros, escreve críticas (<=1000 chars) e filtra acervo"| Sys
  Sys -->|"Valida credenciais / sessão JWT (quando .env configurado)"| FbAuth
  Sys -->|"Sincroniza users/{uid}/books e users/{uid}/categories"| FbStore
```

---

## 3. Arquitetura C4 — Nível 2: Diagrama de Contêineres

```mermaid
flowchart TB
  subgraph Cliente["Navegador Web / Dispositivo Instalado (PWA)"]
    UI["Interface React 18 + TypeScript + Tailwind CSS (Terminal HUD)"]
    AuthComp["AuthTerminal.tsx (Login, Registro e Medidor de Força de Senha)"]
    AuthSvc["authService.ts (Gestão de Sessão e Segurança)"]
    StoreSvc["storageService.ts (Sincronização Híbrida e Isolamento por UID)"]
    WebCrypto["Web Crypto API (window.crypto.subtle SHA-256 + Salt)"]
    LocalDB[("localStorage Isolado (librarytrix_books_${uid} / categories_${uid})")]
    SW["Service Worker (Workbox / vite-plugin-pwa)"]

    AuthComp --> AuthSvc
    UI --> AuthSvc
    UI --> StoreSvc
    AuthSvc -->|"Gera salt e compara hash SHA-256"| WebCrypto
    AuthSvc -->|"Persiste usuários e sessão local"| LocalDB
    StoreSvc -->|"Leitura/Escrita síncrona imediata"| LocalDB
    UI -.->|"Cache offline de assets e fontes"| SW
  end

  subgraph Nuvem["Google Firebase (Opcional via .env)"]
    FBA[("Firebase Auth")]
    CFS[("Cloud Firestore + firestore.rules")]
  end

  AuthSvc -->|"createUser / signIn / onAuthStateChanged"| FBA
  StoreSvc -->|"Subcoleções /users/{uid}/books e /categories"| CFS
```

---

## 4. Arquitetura C4 — Nível 3: Diagrama de Componentes React

```mermaid
flowchart TD
  App["App.tsx (Orquestrador de Estado, Sessão, Filtros e Atalhos)"]

  App -->|"Se currentUser == null"| AuthTerminal["AuthTerminal.tsx (Login e Cadastro Multiusuário)"]
  App -->|"Se autenticado"| Header["Header.tsx (Busca 4 Campos CTRL+K, Avatar Iniciais, Logout)"]
  App -->|"Se autenticado"| Sidebar["Sidebar.tsx (Perfil do Operador, Categorias, Exportar, Logout)"]
  App -->|"Se autenticado"| TelemetryStrip["TelemetryStrip.tsx (4 Blocos Superiores Dinâmicos)"]
  App -->|"Se autenticado"| FilterBar["FilterBar.tsx (Chips de Categoria, Nota, País, Ordenação e Busca Mobile)"]
  App -->|"Visão: Catálogo"| BookCard["BookCard.tsx (Card Bento Grid HUD)"]
  App -->|"Visão: Ranking"| RankingView["RankingView.tsx (Classificação Geral #01-#03)"]
  App -->|"Mobile < 1024px"| BottomNav["BottomNav.tsx (Navegação Inferior)"]
  App --> Footer["Footer.tsx (Status de Sincronia e Segurança)"]

  App --> NewBookModal["NewBookModal.tsx (Criar / Editar Livro)"]
  App --> NewCategoryModal["NewCategoryModal.tsx (Criar Categoria + Cor Hexadecimal + Preview)"]
  App --> CritiqueModal["CritiqueModal.tsx (Leitura Integral da Crítica)"]
  App --> ConfirmCategoryDelete["ConfirmCategoryDelete.tsx (Confirmação de Exclusão -> GERAL)"]

  NewBookModal --> Modal1["Modal.tsx (<dialog> nativo)"]
  NewBookModal --> CritiqueEditor["CritiqueEditor.tsx (Limite 1000 Caracteres + Contador)"]
  NewCategoryModal --> Modal2["Modal.tsx"]
  CritiqueModal --> Modal3["Modal.tsx"]
  ConfirmCategoryDelete --> Modal4["Modal.tsx"]

  BookCard --> RatingBar["RatingBar.tsx (Barra HUD Segmentada de 5 Células)"]
  RankingView --> RatingBar
```

---

## 5. Diagrama de Sequência — Autenticação e Isolamento de Dados

```mermaid
sequenceDiagram
  actor Op as Operador
  participant AT as AuthTerminal.tsx
  participant AS as authService.ts
  participant WC as Web Crypto / Firebase Auth
  participant App as App.tsx
  participant SS as storageService.ts
  participant DB as Firestore / localStorage (UID)

  Op->>AT: Preenche credenciais e aciona Login / Registro
  AT->>AS: evaluatePassword(senha) + loginOperator() / registerOperator()
  AS->>WC: Valida via Firebase Auth ou gera/compara SHA-256(salt + senha)
  WC-->>AS: Retorna OperatorUser { uid, email, displayName }
  AS-->>App: Notifica sessão ativa (subscribeAuth)
  App->>SS: loadLocal(user.uid)
  SS->>DB: Lê librarytrix_books_${uid} e librarytrix_categories_${uid}
  DB-->>App: Retorna acervo isolado da conta (ou inicializa seed próprio)
  App->>SS: syncFromCloud(user.uid)
  SS->>DB: Sincroniza /users/{uid}/books e /users/{uid}/categories
  DB-->>App: Atualiza estado (CLOUD / LOCAL / OFFLINE)
  Op->>App: Clica em "[ ENCERRAR SESSÃO ]"
  App->>AS: logoutOperator()
  App->>App: Limpa books, categories e filtros em memória e exibe AuthTerminal
```
