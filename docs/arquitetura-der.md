# Arquitetura e DER — Librarytrix

## C4 — Nível 1: Contexto
```mermaid
C4Context
  Person(op, "Operador", "Leitor que cataloga e critica livros")
  System(lt, "Librarytrix PWA", "Catálogo de leitura Terminal HUD")
  System_Ext(fb, "Firebase Firestore", "Persistência em nuvem (opcional)")
  Rel(op, lt, "Usa")
  Rel(lt, fb, "Sincroniza books/categories")
```

## C4 — Nível 2: Contêineres
```mermaid
flowchart TB
  subgraph Browser
    UI["React + Tailwind (SPA)"]
    AUTH_UI["AuthTerminal.tsx (Login/Registro)"]
    SW["Service Worker (vite-plugin-pwa)"]
    WC["Web Crypto API (SHA-256 + Salt)"]
    LS[("localStorage Isolado por UID")]
    UI --> AUTH_SVC["authService.ts"]
    AUTH_UI --> AUTH_SVC
    AUTH_SVC --> WC
    AUTH_SVC --> LS
    UI --> SVC["storageService.ts"]
    SVC --> LS
    UI -.cache offline.-> SW
  end
  AUTH_SVC -->|"se .env configurado"| FBA[("Firebase Authentication")]
  SVC -->|"users/{uid}/books e categories"| FS[("Cloud Firestore + firestore.rules")]
```

## C4 — Nível 3: Componentes
```mermaid
flowchart LR
  App --> AuthTerminal & Header & Sidebar & TelemetryStrip & FilterBar & BookCard & RankingView & BottomNav & Footer
  App --> NewBookModal & NewCategoryModal & CritiqueModal & ConfirmCategoryDelete
  NewBookModal --> CritiqueEditor
  CritiqueModal --> CritiqueEditor
  BookCard --> RatingBar
  RankingView --> RatingBar
  App --> authService --> firebase
  App --> storageService --> firebase
```

## DER (Firestore e Isolamento por Conta)
```mermaid
erDiagram
  USER ||--o{ CATEGORY : possui
  USER ||--o{ BOOK : cataloga
  CATEGORY ||--o{ BOOK : classifica
  USER {
    string uid PK
    string email UK
    string displayName
    string passwordHash "SHA-256 + salt (local) ou Firebase Auth"
    string createdAt
  }
  CATEGORY {
    string id PK
    string userId FK "USER.uid"
    string name
    string color
    string suffix
  }
  BOOK {
    string id PK "ID_ARQUIVO // 0842-CYB"
    string userId FK "USER.uid"
    string title
    string author
    string category FK "CATEGORY.name"
    number releaseYear
    string originalNationality
    string coverUrl
    number rating "0.0 a 5.0"
    string status "CRITICADO|ARQUIVADO|LENDO|PENDENTE"
    string telemetryTag
    string critique "max 1000 caracteres"
    string syncDate
  }
```
> No Firestore, os documentos ficam isolados em `/users/{userId}/books/{bookId}` e `/users/{userId}/categories/{categoryId}`, protegidos por `firestore.rules` (`request.auth != null && request.auth.uid == userId`). No fallback local, as chaves são prefixadas por UID (`librarytrix_books_${uid}` e `librarytrix_categories_${uid}`).

## Fluxo de Telas
```mermaid
flowchart LR
  Auth["AuthTerminal (Login / Registro)"] -->|"Autenticado"| Catalogo["Catálogo / CATÁLOGO"]
  Catalogo -->|"[ ENCERRAR SESSÃO ]"| Auth
  Catalogo <--> Categorias["Categorias (mobile)"]
  Catalogo <--> Ranking["Ranking / RANKING"]
  Catalogo <--> Perfil["Perfil / MÉTRICAS"]
  Catalogo --> NovoLivro{{Modal Novo/Editar Livro}}
  Catalogo --> Critica{{Modal Crítica 1000 caracteres}}
  Catalogo --> NovaCat{{Modal Nova Categoria}}
  Ranking --> Critica
```

## Estratégia de Persistência e Segurança
1. **Autenticação:** `authService.ts` utiliza Firebase Auth quando `.env` está presente; sem `.env`, utiliza o cofre local com `window.crypto.subtle.digest('SHA-256', ...)` + *salt* exclusivo por operador (senhas nunca são salvas em texto puro).
2. **Isolamento de Dados:** `loadLocal(uid)` lê e grava em `librarytrix_books_${uid}` e `librarytrix_categories_${uid}`. Cada nova conta recebe seu próprio seed inicial independente.
3. **Sincronização Nuvem:** `syncFromCloud(uid)` sincroniza `/users/{uid}/books` e `/users/{uid}/categories`, com regras de segurança em `firestore.rules` validando propriedade do `uid` e `critique.size() <= 1000`.

