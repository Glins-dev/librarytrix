# Termo de Abertura do Projeto (Project Charter) — Librarytrix

| Metadado | Identificação |
|----------|---------------|
| **Projeto** | **Librarytrix // SISTEMA_ARQUIVO (DB-01)** |
| **Versão do Documento** | `1.1.0` |
| **Identidade Visual** | *Cyberpunk Terminal HUD* (`#08080C` / `#0D0E15` / `#00F0FF` / `#39FF14` / `#FF007F`) |
| **Arquitetura** | Progressive Web App (PWA) Multiusuário *Offline-First* (React 18 + TypeScript + Tailwind CSS + Firebase Auth/Firestore + Web Crypto API) |
| **Repositório Oficial** | https://github.com/Glins-dev/librarytrix |

---

## 1. Justificativa e Problema de Negócio

Leitores assíduos, pesquisadores e estudantes que mantêm registros críticos de suas leituras enfrentam três problemas recorrentes nas ferramentas convencionais de catalogação literária:

1. **Fragmentação de Registros e Ausência de Síntese Crítica:** Anotações ficam dispersas em planilhas, blocos de notas genéricos ou redes sociais comerciais poluídas, sem um limite estruturado que incentive resenhas analíticas objetivas nem indicadores visuais imediatos de qualidade.
2. **Rigidez Taxonômica:** Sistemas tradicionais impõem gêneros fixos e não permitem que o leitor crie suas próprias categorias temáticas com identidade cromática personalizada (código hexadecimal próprio e sufixos de protocolo de catalogação).
3. **Dependência de Conectividade ou Falta de Isolamento Multiusuário:** Aplicações puramente locais expõem dados entre diferentes usuários do mesmo dispositivo, enquanto aplicações puramente em nuvem deixam de funcionar sem internet ou exigem configuração complexa para testes locais.

O **Librarytrix** resolve esse problema oferecendo um **Sistema de Arquivo Literário e Crítica Pessoal** com estética **Cyberpunk Terminal HUD**, operando em arquitetura **multiusuário segura** (Firebase Authentication com fallback criptográfico local `SHA-256` + *salt*) e persistência híbrida **Offline-First** (Cloud Firestore isolado por conta + `localStorage` prefixado por `uid`).

---

## 2. Visão Geral do Produto

O **Librarytrix (`SISTEMA_ARQUIVO`)** é uma aplicação web progressiva (PWA) responsiva (Desktop e Mobile) projetada como uma estação de telemetria literária de alta densidade informacional. Cada operador autenticado possui um cofre isolado onde pode:

- Catalogar livros com identificador de protocolo automático (`ID_ARQUIVO // NNNN-SUF`), ano de lançamento, nacionalidade original, capa, status de leitura e nota decimal de `0.0` a `5.0 ★` renderizada em barra HUD segmentada de 5 células.
- Redigir críticas literárias concisas no **Terminal de Crítica V4.0**, com limite estrito de **1000 caracteres** e telemetria visual de capacidade (`CARACTERES: XXX / 1000`).
- Criar e excluir categorias personalizadas com **seletor de cor hexadecimal livre** (`#RRGGBB`) e reatribuição automática de integridade para a categoria `GERAL`.
- Monitorar 4 blocos superiores de telemetria em tempo real (Total de Registros, Nota Média Global ou da Categoria Ativa, Último Registro Adicionado e Dominância de Categoria).
- Pesquisar instantaneamente em **4 campos simultâneos** (Título, Autor, Nacionalidade Original e Categoria) ignorando acentuação e caixa, além de consultar o Ranking Geral e exportar backups em `.json`.

---

## 3. Cinco Objetivos SMART

| Código | Objetivo | **S** (Específico) | **M** (Mensurável) | **A** (Atingível) | **R** (Relevante) | **T** (Temporal) |
|--------|----------|--------------------|--------------------|-------------------|-------------------|------------------|
| **OBJ-01** | **Autenticação Multiusuário e Isolamento de Contas** | Implementar tela `AuthTerminal` (Login e Registro) com validação de senha forte, integração Firebase Auth, fallback local `SHA-256 + salt` e isolamento de dados por `uid` (`users/{uid}/**` e `firestore.rules`). | 100% dos testes de isolamento entre contas aprovados; 0 senhas salvas em texto puro no `localStorage`. | Uso nativo do Firebase Auth SDK e da `window.crypto.subtle` (Web Crypto API). | Garante privacidade e suporte real a múltiplos operadores no mesmo navegador ou na nuvem. | Concluído na **Release `v0.2.0` / `v1.1.0`** |
| **OBJ-02** | **CRUD Completo de Livros e Terminal de Crítica de 1000 Caracteres** | Desenvolver o cadastro, edição, leitura e exclusão de livros com nota decimal (`0.0`–`5.0`) e campo de crítica com trava estrita em 1000 caracteres e contador cromático em tempo real. | 100% dos requisitos `[RF03]` a `[RF08]` validados; 0 críticas com mais de 1000 caracteres aceitas no frontend ou no `firestore.rules`. | Validação controlada em estado React (`maxLength={1000}`) e regra no banco de dados. | Padroniza resenhas objetivas e preserva a estabilidade visual do Bento Grid HUD. | Concluído na **Release `v0.2.0`** |
| **OBJ-03** | **Gestão Dinâmica de Categorias com Cor Hexadecimal Livre** | Permitir criar categorias com presets Neon Phosphor ou código hexadecimal customizado (`/^#([0-9A-F]{3}){1,2}$/i`) sincronizado com `<input type="color">`, além de exclusão segura com migração automática de livros para `GERAL`. | Criação e exclusão de categorias em `< 2` cliques; 0 livros órfãos após exclusão de categoria. | Aplicação de cores via `style` inline dinâmico nos componentes React. | Oferece liberdade taxonômica total sem risco de corrupção referencial do acervo. | Concluído na **Release `v0.2.0`** |
| **OBJ-04** | **Telemetria em Tempo Real, Busca Multicritério em 4 Campos e Ranking** | Implementar os 4 cards superiores de telemetria dinâmica, a busca insensível a acentos por título, autor, nacionalidade e categoria (`CTRL+K`), filtros combinados, Ranking e exportação `.json`. | Filtragem e recálculo de métricas em `< 50 ms` para acervos de até 5.000 obras. | Memorização com `useMemo` e normalização Unicode `NFD` no cliente. | Permite localização imediata e visão analítica do perfil de leitura do operador. | Concluído na **Release `v0.3.0`** |
| **OBJ-05** | **Entrega PWA Offline-First, Documentação Acadêmica e Git Flow** | Configurar Service Worker/Manifesto PWA, produzir os 6 artefatos de Engenharia de Software em `docs/` e estruturar o repositório com 15 Issues, branches Git Flow e tags SemVer (`v0.1.0` a `v1.0.0`). | Build de produção (`tsc -b && vite build`) com 0 erros, 6 documentos completos em `docs/` e 15 Issues rastreadas no GitHub. | Uso do `vite-plugin-pwa` e automação via GitHub CLI (`gh`). | Cumpre integralmente os critérios acadêmicos e profissionais de Engenharia de Software. | Concluído na **Release `v1.0.0`** |

---

## 4. Escopo Preliminar do Projeto

### 4.1. Dentro do Escopo (*In-Scope* — Entregue)
- **Autenticação e Segurança (`AuthTerminal` & `authService`):**
  - Cadastro e login de operadores com e-mail, codinome e senha forte (mínimo 8 caracteres, maiúscula, minúscula e número/símbolo).
  - Indicador visual de força de senha em barras neon (`FRACA`, `MÉDIA`, `FORTE`) e botão mostrar/ocultar senha.
  - Hashing `SHA-256` com *salt* criptográfico por usuário no modo local e proteção contra força bruta (bloqueio após 5 tentativas falhas).
  - Isolamento estrito de livros e categorias por `uid` no Firestore (`users/{uid}/books`, `users/{uid}/categories`) e no `localStorage` (`librarytrix_books_${uid}`, `librarytrix_categories_${uid}`), protegido por `firestore.rules`.
- **Gestão do Acervo Literário (CRUD de Livros):**
  - Cadastro, edição e exclusão de livros com geração automática de `ID_ARQUIVO // NNNN-SUF`.
  - Avaliação de `0.0` a `5.0 ★` com suporte a casas decimais e barra HUD segmentada de 5 células.
  - Crítica literária com limite estrito de **1000 caracteres**, contador dinâmico (`CARACTERES: XXX / 1000`) e modal de leitura completa (`[ VER CRÍTICA COMPLETA ]`).
- **Gestão Taxonômica (Categorias Customizadas):**
  - 5 categorias iniciais por conta (`Cyberpunk`, `Ficção Científica`, `Distopia`, `Filosofia`, `História`).
  - Criação de novas categorias com presets Neon Phosphor, input hexadecimal customizado, seletor `<input type="color">` e preview de etiqueta em tempo real.
  - Exclusão de categorias com confirmação e reatribuição automática dos livros vinculados para a categoria `GERAL` (`#849495`).
- **Telemetria, Busca Multicritério e Portabilidade de Dados:**
  - 4 blocos superiores de telemetria (`REGISTROS // TOTAL`, `MÉTRICA // GERAL` ou `[CATEGORIA]`, `ÚLTIMO REGISTRO // ADIÇÃO`, `DADOS // DOMINÂNCIA`).
  - Busca textual em tempo real (`BUSCAR >`, atalho `CTRL+K`, botão `[ X ]`) verificando **título, autor, nacionalidade original e categoria** sem diferenciar acentos ou maiúsculas/minúsculas.
  - Visão de `RANKING // CLASSIFICAÇÃO GERAL` ordenada por nota e exportação de backup `.json` (`[ SALVAR PACOTE DE DADOS ]`).
- **PWA e Engenharia de Software:**
  - Manifesto Web App e Service Worker para funcionamento offline.
  - Interface 100% em Português do Brasil (PT-BR) fiel ao Design System `DESIGN.md`.
  - Documentação acadêmica completa em `docs/` e automação Git Flow / GitHub Issues em `scripts/`.

### 4.2. Fora do Escopo (*Out-of-Scope* — Evoluções Futuras)
- Rede social pública para compartilhamento de resenhas ou comentários entre contas distintas.
- Integração com APIs externas de busca automática por ISBN (Google Books API / OpenLibrary).
- Upload direto de arquivos de e-book (`.epub` / `.pdf`) e leitor interno de livros digitais.
- Recuperação de senha via disparo de e-mail SMTP customizado no modo estritamente offline (disponível apenas quando conectado ao Firebase Auth).
- Aplicativos nativos compilados para iOS App Store ou Google Play Store (atendido via instalação PWA).

---

## 5. Stakeholders e Público-Alvo

| Stakeholder / Papel | Perfil / Descrição | Interesse Principal | Critério de Aceitação |
|---------------------|--------------------|---------------------|-----------------------|
| **Operador / Leitor (Usuário Final)** | Leitores ávidos, estudantes universitários, pesquisadores e entusiastas de ficção científica, filosofia e literatura técnica. | Catalogar leituras, atribuir notas precisas, redigir críticas rápidas de até 1000 caracteres e filtrar seu acervo pessoal com rapidez. | Interface responsiva em PT-BR, busca instantânea sem acentos e isolamento seguro de sua conta. |
| **Engenheiro de Software / Autor (`Glins-dev`)** | Desenvolvedor responsável pela arquitetura, implementação full-stack, segurança e documentação do sistema. | Entregar código limpo em TypeScript estrito, arquitetura desacoplada e histórico Git Flow exemplar. | Build sem erros (`tsc -b && vite build`), rastreabilidade de requisitos e cobertura completa do backlog. |
| **Banca Avaliadora / Professor Orientador** | Avaliadores acadêmicos da disciplina de Engenharia de Software. | Verificar a aderência metodológica entre documentação (`docs/`), modelo de dados (DER), regras de negócio, Git Flow, Commits Atômicos e SemVer. | Consistência integral entre o código-fonte em `src/`, a documentação em `docs/` e o histórico do repositório no GitHub. |
| **Provedor de Infraestrutura (Firebase / Vercel)** | Plataformas de autenticação, banco de dados NoSQL em nuvem e hospedagem estática/edge. | Hospedar a SPA/PWA com alta disponibilidade e aplicar as regras de segurança `firestore.rules`. | Deploy automatizado a partir da branch `main` e execução sem falhas das regras de segurança. |

---

## 6. Premissas, Restrições e Riscos

### 6.1. Premissas
1. O navegador do usuário possui suporte a ES2020+, `localStorage`, `window.crypto.subtle` (Web Crypto API) e Service Workers.
2. Em ambientes de avaliação acadêmica onde variáveis `.env` do Firebase não forem fornecidas, o sistema deve operar com 100% das funcionalidades ativas através do provedor local seguro.

### 6.2. Restrições Técnicas e Visuais
1. **Geometria Brutalista (`0px` border-radius):** Nenhum componente pode utilizar bordas arredondadas, preservando a estética de terminal tático definida em `DESIGN.md`.
2. **Limite Estrito de Crítica:** Nenhuma crítica pode ultrapassar **1000 caracteres**, tanto na interface quanto nas regras do banco (`firestore.rules`).
3. **Idioma:** Toda a interface e a documentação devem estar padronizadas em **Português do Brasil (PT-BR)**.

### 6.3. Matriz de Riscos

| ID | Risco Identificado | Probabilidade | Impacto | Estratégia de Mitigação Implementada |
|----|--------------------|---------------|---------|--------------------------------------|
| **RSK-01** | Ausência de credenciais `.env` do Firebase durante a avaliação ou queda de conexão de rede. | Alta | Alto | Implementação de fallback automático em `authService.ts` (`SHA-256 + salt`) e `storageService.ts` (`localStorage` isolado por `uid`). |
| **RSK-02** | Classes dinâmicas de cores de categorias não serem compiladas pelo JIT do Tailwind CSS em runtime. | Alta | Médio | Aplicação das cores hexadecimais customizadas diretamente via atributo `style` inline nos cards, bordas, textos e etiquetas. |
| **RSK-03** | Exclusão de uma categoria deixar livros cadastrados sem referência válida no acervo. | Média | Alto | Rotina transacional `removeCategory()` que migra automaticamente todos os livros afetados para a categoria protegida `GERAL` (`#849495`). |
| **RSK-04** | Acesso indevido a livros de outro usuário no mesmo navegador ou no Firestore. | Baixa | Crítico | Chaves locais isoladas por `uid` (`librarytrix_books_${uid}`), limpeza imediata de memória no logout e `firestore.rules` validando `request.auth.uid == userId`. |
