# Termo de Abertura do Projeto — Librarytrix

## 1. Justificativa
Leitores que registram críticas e notas de livros costumam dispersá-las entre planilhas, notas e apps genéricos, sem classificação própria nem leitura rápida do acervo. O **Librarytrix** centraliza o catálogo pessoal de leitura com críticas curtas (até 1000 caracteres), notas de 0 a 5, categorias customizáveis e telemetria do acervo, em uma interface PWA responsiva com identidade visual *Terminal HUD* cyberpunk que funciona offline.

## 2. Objetivos (SMART)
| # | Objetivo | Mensurável | Prazo |
|---|----------|-----------|-------|
| O1 | Entregar CRUD completo de livros e categorias | 100% dos RF01–RF06 aprovados nos critérios de aceite | Sprint 2 |
| O2 | Funcionar offline sem configuração | App abre com 6 livros-semente sem `.env` | Sprint 1 |
| O3 | Garantir limite de crítica | 0 críticas > 1000 caracteres persistidas | Sprint 2 |
| O4 | Entregar PWA instalável | Lighthouse PWA "installable" + cache offline | Sprint 3 |
| O5 | Entregar documentação acadêmica completa | 6 documentos em `docs/` + README | Sprint 3 |

## 3. Escopo
### Dentro do escopo (In)
- CRUD de livros e criação dinâmica de categorias.
- Criação de categorias com cor hexadecimal customizada e exclusão de categorias (com reatribuição a `GERAL`).
- Notas HUD (0–5, decimais), ranking e ordenação.
- Filtros combinados (categoria, nota mínima, nacionalidade) e busca em tempo real.
- Terminal de crítica com limite máximo de 1000 caracteres e contador em tempo real.
- Telemetria calculada dinamicamente e exportação JSON.
- Persistência Firestore com fallback automático em `localStorage`.
- PWA (manifesto + service worker).

### Fora do escopo (Out)
- Autenticação multiusuário e compartilhamento social.
- Importação automática de metadados (ISBN/APIs externas).
- Aplicativo nativo (iOS/Android).
- Edição de categorias existentes (renomear/recolorir) — backlog futuro.

## 4. Stakeholders
| Stakeholder | Papel | Interesse |
|-------------|-------|-----------|
| Leitor/Operador | Usuário final | Registrar, buscar e criticar livros rapidamente |
| Equipe de desenvolvimento | Implementação | Entregar escopo com qualidade |
| Professor/Orientador | Avaliador acadêmico | Artefatos de Engenharia de Software rastreáveis |
| Firebase/Google Cloud | Provedor | Persistência em nuvem opcional |

## 5. Premissas e Restrições
- Premissa: navegador moderno com `localStorage` e Service Workers.
- Restrição: o app deve funcionar sem variáveis `.env`.
- Restrição: geometria sharp (0px) e paleta do `DESIGN.md`.

## 6. Riscos
| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| Firestore indisponível | Média | Médio | Fallback automático em `localStorage` |
| Perda de dados locais | Baixa | Alto | Exportação JSON |
| Divergência visual dos protótipos | Média | Médio | Tokens Tailwind idênticos aos protótipos |

