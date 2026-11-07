# Histórias de Usuário e Critérios de Aceite (BDD / Gherkin) — Librarytrix

> Todas as histórias de usuário seguem o formato canônico ágil (**"Como [ator], quero [ação] para que [valor de negócio]"**) e possuem Critérios de Aceite formais redigidos na sintaxe **BDD/Gherkin** (`Funcionalidade`, `Cenário`, `Dado`, `Quando`, `E`, `Então`).

---

## US01 — Autenticação Multiusuário e Isolamento de Conta (`[RF01]`, `[RF02]`)

**Como** operador do sistema,  
**quero** criar minha própria conta com senha forte e autenticar-me de forma segura,  
**para que** meu acervo de livros e categorias fique totalmente isolado de outros usuários no mesmo dispositivo ou na nuvem.

```gherkin
Funcionalidade: Autenticação Multiusuário e Isolamento de Acervo por Conta

  Cenário: Bloqueio de acesso ao catálogo quando não autenticado
    Dado que não existe uma sessão de operador ativa no navegador
    Quando acesso a URL principal do Librarytrix
    Então o catálogo principal não é renderizado
    E visualizo exclusivamente a tela "TERMINAL DO OPERADOR" (AuthTerminal) com as abas "[ AUTENTICAR OPERADOR ]" e "[ REGISTRAR NOVO OPERADOR ]"

  Cenário: Registro de novo operador com validação de senha forte em barras neon
    Dado que selecionei a aba "[ REGISTRAR NOVO OPERADOR ]"
    Quando preencho o Nome de Operador "OPERADOR_NEON" e o e-mail "neon@librarytrix.io"
    E digito a senha "Cyber@2026"
    Então o medidor de força de senha exibe "[ FORTE ]" com 3 barras acesas na cor verde neon "#39ff14"
    E quando confirmo a mesma senha e clico em "[ CRIAR CONTA E INICIALIZAR ACERVO ]"
    Então minha conta é criada sem armazenar a senha em texto puro (usando Firebase Auth ou hash SHA-256 + salt)
    E sou redirecionado ao catálogo vendo meu nome "OPERADOR_NEON" e as iniciais "ON" no cabeçalho e na Sidebar

  Cenário: Rejeição de senha fraca durante o cadastro
    Dado que estou na aba "[ REGISTRAR NOVO OPERADOR ]"
    Quando digito a senha "12345"
    Então o medidor de força exibe "[ FRACA ]" na cor magenta "#ff007f"
    E quando tento submeter o formulário
    Então vejo a mensagem "ERRO DE SEGURANÇA: A senha deve conter no mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 número ou símbolo."

  Cenário: Isolamento estrito de livros e categorias entre duas contas distintas
    Dado que a operadora "ana@librarytrix.io" está autenticada e cadastrou o livro "Solaris" e a categoria "Biopunk"
    E a operadora "ana@librarytrix.io" clicou em "[ ENCERRAR SESSÃO ]"
    Quando o operador "bruno@librarytrix.io" se autentica em sua própria conta
    Então "bruno@librarytrix.io" visualiza apenas os registros de "librarytrix_books_<uid_bruno>" (ou "users/<uid_bruno>/books")
    E não visualiza o livro "Solaris" nem a categoria "Biopunk" da conta de Ana

  Cenário: Encerramento de sessão e limpeza imediata de estado em memória
    Dado que estou autenticado no catálogo como "OPERADOR_NEON"
    Quando clico no botão "[ ENCERRAR SESSÃO ]" no cabeçalho ou na Sidebar
    Então os livros, categorias e filtros em memória são limpos imediatamente
    E a aplicação retorna para a tela de bloqueio "AuthTerminal"
```

---

## US02 — Cadastro, Edição e Exclusão de Livros (`[RF03]`, `[RF04]`, `[RF05]`, `[RF06]`)

**Como** operador autenticado,  
**quero** cadastrar, editar e excluir livros com nota decimal de `0.0` a `5.0` e metadados completos,  
**para que** eu mantenha meu catálogo literário organizado e avaliado visualmente no Bento Grid HUD.

```gherkin
Funcionalidade: Gestão do Acervo Literário (CRUD de Livros)

  Cenário: Cadastro válido de um novo livro com geração automática de ID_ARQUIVO
    Dado que estou autenticado e cliquei em "[ + NOVO LIVRO ]"
    Quando preencho o título "Count Zero", autor "William Gibson", categoria "Cyberpunk", ano "1986", nacionalidade "EUA" e nota "4.8"
    E clico em "[ SALVAR CRÍTICA ]"
    Então o sistema gera um identificador no formato "ID_ARQUIVO // 0843-CYB"
    E o card de "Count Zero" passa a ser exibido no Bento Grid com a nota "4.8 ★" e a barra HUD de 5 células preenchida proporcionalmente

  Cenário: Validação de nota fora do intervalo permitido (0.0 a 5.0)
    Dado que abri o modal "NOVO REGISTRO DE LIVRO"
    Quando preencho título e autor válidos, mas informo a nota "6.5"
    E tento salvar o formulário
    Então vejo a mensagem "ERRO: nota deve estar entre 0.0 e 5.0."
    E o modal permanece aberto para correção

  Cenário: Edição e exclusão de livro existente
    Dado que o livro "Neuromancer" está listado no catálogo
    Quando clico no ícone de edição do card, altero a nota para "5.0" e salvo
    Então o card e as métricas superiores passam a refletir a nova nota imediatamente
    E quando clico no ícone de exclusão e confirmo a janela de diálogo
    Então o livro é removido do catálogo e do armazenamento da minha conta
```

---

## US03 — Crítica Literária com Limite Estrito de 1000 Caracteres (`[RF07]`, `[RF08]`)

**Como** operador autenticado,  
**quero** redigir críticas literárias com limite estrito de 1000 caracteres e contador cromático em tempo real,  
**para que** minhas resenhas permaneçam concisas, padronizadas e legíveis no modal de crítica completa.

```gherkin
Funcionalidade: Terminal de Crítica V4.0 com Limite Estrito de 1000 Caracteres

  Cenário: Monitoramento do contador e alerta amarelo acima de 900 caracteres
    Dado que estou no campo "TERMINAL DE CRÍTICA V4.0 // LIMITE: 1000 CARACTERES" do modal de livro
    Quando digito um texto contendo 920 caracteres
    Então o indicador exibe "CARACTERES: 920 / 1000"
    E a cor do contador muda para amarelo neon "#ffb800"

  Cenário: Bloqueio estrito ao atingir 1000 caracteres com alerta magenta
    Dado que digitei exatamente 1000 caracteres no campo de crítica
    Quando tento digitar o caractere de número 1001
    Então nenhum caractere adicional é inserido no campo ("maxLength=1000" e "critique.length <= 1000")
    E o contador exibe "CARACTERES: 1000 / 1000" na cor magenta "#ff007f"

  Cenário: Leitura da crítica integral no modal dedicado
    Dado um livro cadastrado com uma crítica de 850 caracteres
    Quando clico no botão "[ VER CRÍTICA COMPLETA ]" no card do livro
    Então abre-se o modal exibindo o texto integral da crítica, a data "REGISTRADO EM:" e o botão "[ EDITAR NO REGISTRO ]"
```

---

## US04 — Criação e Exclusão de Categorias com Cor Hexadecimal Personalizada (`[RF09]`, `[RF10]`)

**Como** operador autenticado,  
**quero** criar categorias escolhendo um código hexadecimal personalizado (com seletor visual e preview em tempo real) e excluir categorias obsoletas sem perder livros,  
**para que** eu personalize a identidade visual do meu acervo mantendo a integridade dos registros.

```gherkin
Funcionalidade: Gestão Dinâmica de Categorias com Código Hexadecimal e Exclusão Segura

  Cenário: Criação de categoria digitando código hexadecimal customizado
    Dado que abri o modal "[ + NOVA CATEGORIA ]" (ou pressionei ALT+N)
    Quando preencho o nome "Biopunk", o sufixo "BIO" e digito "#FF0055" no campo de cor hexadecimal
    Então o seletor "<input type=color>" e a "PRÉ-VISUALIZAÇÃO DA ETIQUETA" atualizam imediatamente para a cor "#FF0055"
    E quando clico em "[ REGISTRAR NO BANCO ]"
    Então a categoria "BIOPUNK" passa a aparecer na Sidebar e nos Filter Chips estilizada via style inline com "#FF0055"

  Cenário: Rejeição de código hexadecimal em formato inválido
    Dado que abri o modal "[ + NOVA CATEGORIA ]"
    Quando informo o código de cor "#GG99ZZ" e tento registrar
    Então vejo a mensagem "ERRO: cor hexadecimal inválida (ex.: #00F0FF)."
    E a categoria não é salva

  Cenário: Exclusão de categoria com livros vinculados (reatribuição para GERAL)
    Dado que a categoria "Distopia" possui o livro "1984" vinculado a ela
    Quando clico no botão de excluir da categoria "Distopia"
    Então vejo o modal "CONFIRMAR EXCLUSÃO // Deseja remover esta categoria?" informando que 1 livro será movido para "GERAL"
    E quando clico em "[ CONFIRMAR_EXCLUSÃO ]"
    Então a categoria "Distopia" é removida
    E o livro "1984" é automaticamente reatribuído para a categoria "GERAL" na cor neutra "#849495"
```

---

## US05 — Busca Multicritério em 4 Campos (Sem Acentos) e Filtros Combinados (`[RF12]`, `[RF13]`)

**Como** operador autenticado,  
**quero** pesquisar livros em tempo real por título, autor, nacionalidade original ou categoria ignorando acentos e maiúsculas/minúsculas,  
**para que** eu localize qualquer obra do meu acervo instantaneamente.

```gherkin
Funcionalidade: Barra de Busca Multicritério (4 Campos) e Filtros Combinados

  Cenário: Busca textual insensível a acentos e caixa nos 4 campos
    Dado que meu acervo contém livros de "Ficção Científica", nacionalidade "FRANÇA" e autor " Albert Camus"
    Quando digito "ficcao" na barra "BUSCAR >"
    Então o catálogo filtra e exibe os livros da categoria "Ficção Científica"
    E quando substituo o termo por "franca"
    Então o catálogo exibe os livros cuja nacionalidade original é "FRANÇA"

  Cenário: Limpeza rápida do termo de busca pelo botão [ X ]
    Dado que digitei "gibson" na barra "BUSCAR >"
    Quando clico no botão "[ X ]" dentro da barra de busca
    Então o campo de busca é limpo imediatamente, o foco permanece no input e todos os livros voltam a ser listados

  Cenário: Estado vazio quando nenhum livro corresponde à busca atual
    Dado que estou na visão de Catálogo
    Quando digito "termo-inexistente-999" na barra "BUSCAR >"
    Então o grid exibe a mensagem "NENHUM REGISTRO ENCONTRADO PARA A BUSCA ATUAL"
    E exibe o botão "[ LIMPAR FILTROS ]" que restaura o catálogo ao ser clicado
```

---

## US06 — Painel Superior de Telemetria em 4 Blocos (`[RF11]`)

**Como** operador autenticado,  
**quero** visualizar 4 blocos de telemetria dinâmica no topo da interface,  
**para que** eu acompanhe o volume total do acervo, a nota média global ou por categoria selecionada, o último livro adicionado e a categoria dominante.

```gherkin
Funcionalidade: Telemetria Superior em Tempo Real (TelemetryStrip)

  Cenário: Bloco 1 (REGISTROS // TOTAL) e Bloco 2 em modo TODOS (MÉTRICA // GERAL)
    Dado que possuo 6 livros cadastrados em 5 categorias e o filtro de categoria está em "TODOS"
    Então o Bloco 1 exibe "REGISTROS // TOTAL", status "SIS:ATIVO", valor "6 Vol" e rodapé "Codex Principal"
    E o Bloco 2 exibe "MÉTRICA // GERAL", a média aritmética de todos os 6 livros e o rodapé "Média Global do Site"

  Cenário: Bloco 2 recalculado dinamicamente ao selecionar uma Categoria
    Quando seleciono a categoria "Cyberpunk" (cor "#39ff14") na Sidebar ou nos Filter Chips
    Então o Bloco 2 altera seu cabeçalho para "MÉTRICA // CYBERPUNK"
    E exibe a média apenas dos livros de "Cyberpunk", o rodapé "2 Vols na Categoria" e estilização na cor "#39ff14"

  Cenário: Bloco 3 (ÚLTIMO REGISTRO // ADIÇÃO) e Bloco 4 (DADOS // DOMINÂNCIA)
    Dado que o último livro cadastrado foi "Neuromancer" de "William Gibson" com nota "5.0"
    Então o Bloco 3 exibe o título "Neuromancer", o autor "William Gibson" e a badge "5.0 ★" na cor da categoria
    E o Bloco 4 exibe "DADOS // DOMINÂNCIA" com a tag "MAIOR CATEGORIA", o nome e o percentual da categoria com mais livros no acervo
```

---

## US07 — Ranking Geral e Exportação de Pacote de Dados JSON (`[RF14]`, `[RF15]`)

**Como** operador autenticado,  
**quero** consultar a classificação geral dos meus livros por nota e exportar um backup `.json`,  
**para que** eu visualize minhas obras de maior destaque e mantenha cópias de segurança externas do meu acervo.

```gherkin
Funcionalidade: Ranking Geral e Exportação de Dados

  Cenário: Visualização do Ranking ordenado por nota
    Quando clico em "RANKING" na barra de navegação
    Então visualizo a tela "RANKING // CLASSIFICAÇÃO GERAL" ordenada da maior para a menor nota com destaque para "#01", "#02" e "#03"

  Cenário: Download de pacote de dados JSON
    Quando clico em "[ SALVAR PACOTE DE DADOS ]"
    Então o navegador realiza o download do arquivo "librarytrix-backup-AAAA-MM-DD.json" contendo minhas categorias e meus livros
```
