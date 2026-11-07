# Histórias de Usuário e Critérios de Aceite (BDD/Gherkin)

## US01 — Cadastrar livro
**Como** leitor, **quero** cadastrar um livro com nota e categoria, **para** manter meu acervo organizado.
```gherkin
Funcionalidade: Cadastro de livro
  Cenário: Cadastro válido
    Dado que abri o modal "NOVO REGISTRO DE LIVRO"
    Quando preencho título "Neuromancer", autor "William Gibson" e nota "4.9"
    E confirmo em "[ SALVAR CRÍTICA ]"
    Então o livro aparece no catálogo com "4.9 ★"
  Cenário: Nota inválida
    Quando informo a nota "7"
    Então vejo "ERRO: nota deve estar entre 0.0 e 5.0."
```

## US02 — Categorias customizadas
**Como** leitor, **quero** criar categorias com cor neon ou código hexadecimal próprio, **para** classificar gêneros próprios.
```gherkin
Funcionalidade: Nova categoria
  Cenário: Criar categoria com preset
    Dado que abri "+ NOVA CATEGORIA"
    Quando informo nome "Biopunk", seleciono a cor "#39FF14" e sufixo "BIO"
    E clico em "[ REGISTRAR NO BANCO ]"
    Então "BIOPUNK" aparece na sidebar e nos chips de filtro
  Cenário: Nome duplicado
    Quando informo o nome "Cyberpunk"
    Então vejo "ERRO: categoria já existe."

Funcionalidade: Inserção de código de cor hexadecimal na categoria
  Cenário: Hexadecimal válido com preview
    Dado que abri "+ NOVA CATEGORIA"
    Quando digito "#FF0055" no campo hexadecimal
    Então o seletor visual e o preview da etiqueta passam a usar "#FF0055"
    E ao salvar, cards, bordas, textos e etiquetas da categoria usam essa cor
  Cenário: Seletor visual sincronizado
    Quando escolho uma cor no "<input type=color>"
    Então o campo de texto exibe o hexadecimal correspondente
  Cenário: Hexadecimal inválido
    Quando digito "#GG1234" e tento salvar
    Então vejo "ERRO: cor hexadecimal inválida (ex.: #00F0FF)."
    E a categoria não é criada
  Cenário: Formato curto
    Quando digito "#0FF" e salvo
    Então a cor é gravada como "#00FFFF"
```

## US02B — Exclusão de categorias
**Como** leitor, **quero** excluir categorias que não uso mais, **para** manter a classificação enxuta sem perder livros.
```gherkin
Funcionalidade: Exclusão de categoria
  Cenário: Excluir categoria sem livros
    Dado a categoria "Biopunk" sem livros vinculados
    Quando clico em excluir e confirmo em "CONFIRMAR EXCLUSÃO"
    Então "BIOPUNK" desaparece da sidebar, dos chips e da aba Categorias
  Cenário: Excluir categoria com livros vinculados
    Dado a categoria "Distopia" com o livro "1984"
    Quando confirmo a exclusão
    Então "1984" é reatribuído à categoria "GERAL" na cor "#849495"
    E o card continua sendo renderizado normalmente
  Cenário: Cancelar exclusão
    Quando clico em "[ CANCELAR ]"
    Então a categoria permanece
  Cenário: Categoria padrão protegida
    Então a categoria "GERAL" não exibe botão de exclusão
```

## US03 — Crítica com limite de 1000 caracteres
**Como** leitor, **quero** escrever uma crítica com limite máximo de 1000 caracteres, **para** manter críticas objetivas.
```gherkin
Funcionalidade: Terminal de crítica
  Cenário: Limite de caracteres
    Dado um editor com 1000 caracteres digitados
    Quando tento digitar mais um caractere
    Então nenhum caractere é inserido
    E o contador "CARACTERES: 1000 / 1000" fica magenta "#ff007f"
  Cenário: Alerta de proximidade do limite
    Quando o texto passa de 900 caracteres
    Então o contador fica amarelo "#ffb800"
  Cenário: Submissão rápida
    Dado uma crítica digitada
    Quando pressiono CTRL+ENTER
    Então a crítica é gravada no livro selecionado
```

## US04 — Filtros e busca
**Como** leitor, **quero** combinar filtros e buscar por título, autor, nacionalidade ou categoria sem me preocupar com acentos, **para** achar livros rapidamente.
```gherkin
Funcionalidade: Filtros combinados e busca em 4 campos
  Cenário: Categoria + nota mínima
    Quando seleciono a categoria "Cyberpunk" e a nota "[4.5+ ★]"
    Então somente livros Cyberpunk com nota >= 4.5 são exibidos
  Cenário: Busca textual por título, autor, nacionalidade ou categoria (ignorando acentos)
    Quando digito "ficcao" ou "franca" em "BUSCAR >"
    Então vejo os livros correspondentes à categoria "Ficção Científica" ou nacionalidade "FRANÇA"
  Cenário: Limpar busca pelo botão [ X ]
    Dado que digitei um termo em "BUSCAR >"
    Quando clico no botão "[ X ]" dentro da barra de busca
    Então o texto é limpo e todos os livros voltam a ser exibidos
  Cenário: Nenhum livro encontrado para a busca
    Quando digito "xyz-inexistente" em "BUSCAR >"
    Então vejo "NENHUM REGISTRO ENCONTRADO PARA A BUSCA ATUAL" e o botão "[ LIMPAR FILTROS ]"
```

## US05 — Ordenação e ranking
**Como** leitor, **quero** ordenar e ver o ranking, **para** destacar meus melhores livros.
```gherkin
Funcionalidade: Ranking
  Cenário: Ordenar por maior nota
    Quando escolho "MAIOR NOTA [DESC]"
    Então "Neuromancer (5.0)" aparece antes de "Duna (4.9)"
  Cenário: Classificação Geral
    Quando abro "RANKING"
    Então o primeiro item exibe "#01"
```

## US06 — Telemetria Superior (4 Blocos HUD)
**Como** leitor, **quero** visualizar 4 blocos de telemetria em tempo real no topo do sistema, **para** acompanhar o total do acervo, a nota média (geral ou por categoria), o último livro adicionado e a categoria dominante.
```gherkin
Funcionalidade: Telemetria dinâmica (TelemetryStrip)
  Cenário: Bloco 1 — Total absoluto de itens cadastrados
    Dado 6 livros cadastrados em 5 categorias e um filtro de categoria ativo
    Então o card "REGISTROS // TOTAL" com status "SIS:ATIVO" continua exibindo "6 Vol" e "Codex Principal"

  Cenário: Bloco 2 — Nota média global (TODOS selecionado)
    Dado que o filtro de categoria está em "TODOS"
    Então o segundo card exibe o header "MÉTRICA // GERAL", a média aritmética de todos os livros e o rodapé "Média Global do Site"

  Cenário: Bloco 2 — Nota média da categoria selecionada com cor dinâmica
    Quando seleciono a categoria "Cyberpunk" (cor "#39ff14")
    Então o segundo card exibe "MÉTRICA // CYBERPUNK", a média apenas dos livros de Cyberpunk, o rodapé "2 Vols na Categoria" e estilização em "#39ff14"

  Cenário: Bloco 2 — Categoria selecionada sem livros
    Dado uma categoria recém-criada "Biopunk" sem livros
    Quando seleciono a categoria "Biopunk"
    Então o segundo card exibe "0.0 ★ MÉDIA" e "Sem registros"

  Cenário: Bloco 3 — Último livro adicionado (ÚLTIMO REGISTRO // ADIÇÃO)
    Quando cadastro um novo livro "Count Zero" de "William Gibson" na categoria "Cyberpunk" com nota "4.8"
    Então o card "ÚLTIMO REGISTRO // ADIÇÃO" exibe "Count Zero", autor "William Gibson" e "4.8 ★" na cor da categoria
  Cenário: Bloco 3 em estado vazio
    Dado que todos os livros foram removidos do acervo
    Então o card "ÚLTIMO REGISTRO // ADIÇÃO" exibe "NENHUM REGISTRO" e "Aguardando indexação..."

  Cenário: Bloco 4 — Categoria dominante (DADOS // DOMINÂNCIA)
    Dado que "Cyberpunk" possui o maior número de livros no acervo
    Então o card "DADOS // DOMINÂNCIA" com tag "MAIOR CATEGORIA" exibe "Cyberpunk", o percentual correspondente, "X Vols registrados" e aplica a cor Hexadecimal de "Cyberpunk"
```

## US07 — Exportação
**Como** leitor, **quero** exportar meu acervo, **para** ter backup.
```gherkin
Funcionalidade: Exportar JSON
  Cenário: Download do backup
    Quando clico em "EXPORTAR JSON"
    Então um arquivo ".json" com livros e categorias é baixado
```

## US08 — Offline
**Como** leitor, **quero** usar o app sem internet, **para** consultar o acervo em qualquer lugar.
```gherkin
Funcionalidade: Modo offline
  Cenário: Sem .env
    Dado que não há variáveis do Firebase
    Quando abro o app
    Então vejo os 6 livros-semente e os dados persistem no localStorage
```

