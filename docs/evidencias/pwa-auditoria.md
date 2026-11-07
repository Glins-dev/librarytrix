# Evidência de Auditoria PWA e Operação Offline — Librarytrix (`v1.2.0`)

**Referência:** Issue #06 (`[PWA-EVID]`) e Requisito Não Funcional `RNF05` (Progressive Web App / Offline-First).
**Data da Auditoria:** 07/11/2026

---

## 1. Verificação do Web App Manifest (`public/manifest.json` & `dist/manifest.webmanifest`)

O artefato de manifesto da aplicação foi validado no build de produção (`npm run build`) com os seguintes parâmetros obrigatórios da especificação W3C Web App Manifest:

| Propriedade | Valor Configurado | Status |
| :--- | :--- | :---: |
| `name` | `"Librarytrix — Sistema de Arquivo Literário"` | Aprovado |
| `short_name` | `"Librarytrix"` | Aprovado |
| `start_url` | `"/"` | Aprovado |
| `display` | `"standalone"` | Aprovado |
| `background_color` | `"#08080C"` | Aprovado |
| `theme_color` | `"#00F0FF"` | Aprovado |
| `icons` | `192x192` (`image/svg+xml`, `any maskable`) e `512x512` (`image/svg+xml`, `any maskable`) em `public/icons/` | Aprovado |

---

## 2. Verificação do Service Worker e Precache (`vite-plugin-pwa` / Workbox)

Saída real verificada durante a execução do comando `npm run build` (Vite v8.3.6 + `vite-plugin-pwa` v2.0.0):

```text
PWA v2.0.0
mode      generateSW
precache  11 entries (885.89 KiB)
files generated
  dist/sw.js
  dist/workbox-dcde9eb3.js
```

### Estratégias de Cache Ativas (`vite.config.ts` e `public/sw.js`):
1. **App Shell & Assets Estáticos (`CacheFirst` / Precache):** HTML (`index.html`), bundle JS/CSS, manifesto e ícones vetoriais são pré-cacheados na instalação do Service Worker (`11 entries`).
2. **Fontes Tipográficas (`Google Fonts` — `Space Grotesk` e `JetBrains Mono`):** Cacheadas via estratégia `CacheFirst` (`google-fonts-cache`, expiração de 365 dias) para preservar a fidelidade estética Terminal HUD mesmo sem internet.
3. **Dados do Acervo (`storageService.ts`):** Persistência síncrona imediata em `localStorage` isolada por operador (`librarytrix_books_${uid}` e `librarytrix_categories_${uid}`), permitindo CRUD completo de livros, categorias e críticas de até 1000 caracteres em modo `OFFLINE`.

---

## 3. Checklist de Testes de Instalação e Funcionamento Offline

- [x] **Registro do Service Worker (`src/main.tsx`):** Inicializado automaticamente no carregamento da aplicação em produção.
- [x] **Operação com Rede Desconectada (`DevTools -> Network -> Offline`):** A aplicação carrega instantaneamente a partir do cache do Service Worker, exibe o status `MODO_OFFLINE // CACHE_LOCAL` no rodapé HUD e preserva 100% das operações de criação, edição, exclusão, busca multicritério e exportação JSON.
- [x] **Sincronização Híbrida ao Reconectar:** Ao restabelecer a conexão quando o Firebase está ativo, `syncFromCloud(uid)` reconcilia automaticamente os documentos com `/users/{uid}/books` e `/users/{uid}/categories`.
