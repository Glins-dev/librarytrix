---
name: Solicitação de Funcionalidade (Feature / Evolução)
about: Propor uma nova funcionalidade ou melhoria arquitetural para o Librarytrix
title: "[FEAT] "
labels: ["enhancement"]
assignees: []
---

## Contexto e Valor de Negócio (User Story)
Como **[ator]**, quero **[ação]** para que **[valor de negócio]**.

## Requisitos Relacionados
- Requisito Funcional / Não Funcional: `RF__` / `RNF__`

## Critérios de Aceite (BDD / Gherkin)
```gherkin
Funcionalidade: [Nome da Funcionalidade]
  Cenário: [Cenário Principal]
    Dado que ...
    Quando ...
    Então ...
```

## Checklist Técnico
- [ ] Alinhado à estética *Librarytrix Terminal HUD* (`DESIGN.md`)
- [ ] Inclui testes unitários em `src/services/__tests__/` ou `src/components/__tests__/`
- [ ] Atualiza documentação em `docs/` e Matriz de Rastreabilidade no `README.md`
