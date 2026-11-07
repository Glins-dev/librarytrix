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
    SW["Service Worker (vite-plugin-pwa)"]
    LS[("localStorage")]
    UI --> SVC["storageService.ts"]
    SVC --> LS
    UI -.cache offline.-> SW
  end
  SVC -->|"se .env configurado"| FS[("Cloud Firestore")]
```

## C4 — Nível 3: Componentes
```mermaid
flowchart LR
  App --> Header & Sidebar & TelemetryStrip & FilterBar & BookCard & RankingView & BottomNav & Footer
  App --> NewBookModal & NewCategoryModal & CritiqueModal
  NewBookModal --> CritiqueEditor
  CritiqueModal --> CritiqueEditor
  BookCard --> RatingBar
  RankingView --> RatingBar
  App --> storageService --> firebase
```

## DER (Firestore)
```mermaid
erDiagram
  CATEGORY ||--o{ BOOK : classifica
  CATEGORY {
    string id PK
    string name
    string color
    string suffix
  }
  BOOK {
    string id PK "ID_ARQUIVO // 0842-CYB"
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
> No Firestore, o ID de documento é o `id` sanitizado (`/` e espaços → `_`); o `id` de exibição permanece no campo.

## Fluxo de Telas
```mermaid
flowchart LR
  Catalogo["Catálogo / CATÁLOGO"] <--> Categorias["Categorias (mobile)"]
  Catalogo <--> Ranking["Ranking / RANKING"]
  Catalogo <--> Perfil["Perfil / MÉTRICAS"]
  Catalogo --> NovoLivro{{Modal Novo/Editar Livro}}
  Catalogo --> Critica{{Modal Crítica 1000 caracteres}}
  Catalogo --> NovaCat{{Modal Nova Categoria}}
  Ranking --> Critica
```

## Estratégia de Persistência
1. Boot: `loadLocal()` lê `localStorage` (pré-carregado com os 6 livros-semente).
2. Se o Firebase estiver configurado, `syncFromCloud()` busca `books`/`categories`; nuvem vazia → envia o seed local.
3. Escritas: `localStorage` sempre; Firestore em seguida. Falha → estado `OFFLINE` (dados locais preservados).

