# Requisitos — Librarytrix

> Total: RF01–RF19 e RNF01–RNF16.

## Requisitos Funcionais

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF01 | O sistema deve cadastrar livros com id (`ID_ARQUIVO // NNNN-SUF`), título, autor, categoria, ano, nacionalidade, capa, nota, status, telemetryTag, crítica e syncDate. | Alta |
| RF02 | O sistema deve permitir editar e excluir livros (com confirmação). | Alta |
| RF03 | O sistema deve listar livros em Bento Grid com badge de categoria, nota e trecho da crítica. | Alta |
| RF04 | O sistema deve criar categorias customizadas (nome, cor Neon Phosphor, sufixo de protocolo) via modal. | Alta |
| RF05 | O sistema deve iniciar com as categorias Cyberpunk, Ficção Científica, Distopia, Filosofia e História. | Alta |
| RF06 | O sistema deve aceitar notas de 0.0 a 5.0 com decimais e exibir `N.N ★` + barra de 5 células. | Alta |
| RF07 | O sistema deve ordenar por maior nota, crítica recente, ano de publicação e título A-Z. | Média |
| RF08 | O sistema deve oferecer visão de Ranking (classificação geral) ordenada por nota. | Média |
| RF09 | O sistema deve filtrar por categoria, nota mínima (5.0, 4.5+, 4.0+, Todos) e nacionalidade combinados. | Alta |
| RF10 | O sistema deve pesquisar em tempo real (Desktop e Mobile, atalho `CTRL+K` / `⌘K`, com botão `[ X ]` para limpar) normalizando acentos e caixa (`normalize('NFD')`) e verificando correspondência em qualquer um dos 4 campos: **título** (`book.title`), **autor** (`book.author`), **nacionalidade original** (`book.originalNationality`) ou **categoria** (`book.category`), exibindo `NENHUM REGISTRO ENCONTRADO PARA A BUSCA ATUAL` + botão `[ LIMPAR FILTROS ]` quando vazio. | Alta |
| RF11 | O campo de crítica (no formulário de Novo/Editar Livro) deve ter limite máximo de 1000 caracteres (`maxLength={1000}` + `critique.length <= 1000`), com contador `CARACTERES: XXX / 1000` (amarelo `#ffb800` acima de 900; magenta `#ff007f` em 1000), e a crítica completa deve ser exibida no modal `[ VER CRÍTICA COMPLETA ]`. | Alta |
| RF12 | O sistema deve permitir submissão rápida via `CTRL+ENTER` no campo de crítica do formulário do livro. | Média |
| RF13 | O sistema deve calcular e exibir em tempo real os 4 blocos de telemetria superior (Desktop e Mobile): (1) `REGISTROS // TOTAL` (`SIS:ATIVO` em `#00f0ff`, total absoluto de livros, rodapé `Codex Principal` + categorias ativas/itens filtrados); (2) Nota Média Dinâmica (`MÉTRICA // GERAL` + `Média Global do Site` + `AVALIADOS: X%` quando TODOS estiver ativo, ou `MÉTRICA // [NOME_DA_CATEGORIA]` + `X Vols na Categoria` na cor Hexadecimal da categoria ativa, exibindo `0.0 ★ MÉDIA` e `Sem registros` se vazia); (3) `ÚLTIMO REGISTRO // ADIÇÃO` (`RECÉM ADICIONADO`, título truncado do último livro adicionado, autor, categoria e nota na cor da categoria, ou `NENHUM REGISTRO` / `Aguardando indexação...` se vazio); e (4) `DADOS // DOMINÂNCIA` (`MAIOR CATEGORIA`, nome e percentual da categoria líder, `X Vols registrados` e 2ª categoria/total de categorias, estilizados na cor Hexadecimal da categoria dominante). | Alta |
| RF14 | O sistema deve exportar o acervo completo em arquivo `.json` (`[ SALVAR PACOTE DE DADOS ]`). | Média |
| RF15 | Na criação de categoria, o sistema deve aceitar código de cor hexadecimal customizado (`#RGB`/`#RRGGBB`, regex `/^#([0-9A-F]{3}){1,2}$/i`) via campo de texto sincronizado com `<input type="color">`, com preview em tempo real da etiqueta, além dos presets Neon Phosphor. | Alta |
| RF16 | O sistema deve permitir excluir categorias (Sidebar, chips mobile e aba Categorias) após confirmação `CONFIRMAR EXCLUSÃO // Deseja remover esta categoria?`; livros vinculados são reatribuídos automaticamente à categoria `GERAL` (`#849495`). | Alta |
| RF17 | O sistema deve permitir o cadastro de novos operadores (`[ REGISTRAR NOVO OPERADOR ]`) com Nome de Operador/Codinome, E-mail, Senha e Confirmação de Senha, com botão de mostrar/ocultar senha e medidor visual de força em barras neon (`FRACA` `#ff007f`, `MÉDIA` `#ffb800`, `FORTE` `#39ff14`). | Alta |
| RF18 | O sistema deve autenticar operadores (`[ AUTENTICAR OPERADOR ]`), exibir o nome/codinome real e as iniciais no avatar do cabeçalho e da Sidebar, bloquear o acesso ao catálogo enquanto não autenticado e oferecer o botão `[ ENCERRAR SESSÃO ]` (Logout) limpando o estado em memória imediatamente. | Alta |
| RF19 | O sistema deve isolar integralmente o acervo de livros e categorias por conta de usuário autenticado (`users/{uid}/books` e `users/{uid}/categories` no Firestore, e chaves `librarytrix_books_${uid}` / `librarytrix_categories_${uid}` no armazenamento local), inicializando novas contas de forma independente. | Alta |

## Requisitos Não Funcionais

| ID | Requisito | Métrica |
|----|-----------|---------|
| RNF01 | Persistência em Firebase Firestore (`users/{uid}/books`, `users/{uid}/categories`). | Subcoleções isoladas por UID |
| RNF02 | Fallback automático em `localStorage` sem `.env`. | App funcional em clone limpo |
| RNF03 | Interface responsiva (mobile < 1024px, desktop ≥ 1024px). | Sem scroll horizontal indevido |
| RNF04 | PWA instalável com cache offline. | Manifesto + service worker |
| RNF05 | Geometria sharp, 0px de raio, conforme `DESIGN.md`. | Inspeção visual |
| RNF06 | Tipografia Space Grotesk e JetBrains Mono com números tabulares. | Inspeção visual |
| RNF07 | Código em TypeScript estrito. | `tsc` sem erros |
| RNF08 | Tempo de resposta de filtros/busca imperceptível para até 5.000 registros. | < 100 ms |
| RNF09 | Acessibilidade básica (aria-label, foco visível, `<dialog>` nativo). | Navegação por teclado |
| RNF10 | Segredos fora do repositório (`.env` no `.gitignore`). | `.env.example` versionado |
| RNF11 | Cores customizadas aplicadas via `style` inline (Tailwind não compila classes dinâmicas em runtime). | Cards, bordas, textos e badges com cor da categoria |
| RNF12 | Integridade referencial: nenhum livro pode ficar com categoria inexistente. | Exclusão reatribui a `GERAL` |
| RNF13 | Segurança de senhas no provedor local: **nunca** salvar senhas em texto puro; aplicar hash `SHA-256` (`window.crypto.subtle.digest`) com *salt* criptográfico exclusivo por usuário e bloqueio temporário após 5 tentativas inválidas. | 0 senhas em texto puro no `localStorage` |
| RNF14 | Autenticação em nuvem via token JWT gerenciado pelo Firebase Authentication (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged`). | Sessão autenticada via Firebase Auth |
| RNF15 | Política de força de senha no frontend: mínimo de 8 caracteres, contendo ao menos 1 letra maiúscula, 1 letra minúscula e 1 número ou caractere especial. | Validação síncrona antes do registro |
| RNF16 | Controle de acesso e validação no banco via `firestore.rules`: leitura e escrita restritas a `request.auth != null && request.auth.uid == userId`, com validação de `critique.size() <= 1000` diretamente na regra do Firestore. | Regra versionada em `firestore.rules` |

