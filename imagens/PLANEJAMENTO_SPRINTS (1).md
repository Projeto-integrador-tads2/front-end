# Planejamento de Sprints (Versão Ajustada: Pipeline/Stages antes de Interesses)

> Alteração solicitada: Priorizar o funcionamento do funil / kanban (Stages/Steps) antes da associação de interesses a serviços.  
> Resultado: A antiga Sprint 4 (Stages) foi movida para a Sprint 3, e Serviços + Interesses passaram para a Sprint 4. Pequenos ajustes de dependências foram feitos.

## 1. Visão Geral
Objetivo: Construir um MVP de um sistema interno para:
- Cadastrar e gerenciar clientes e seus estágios no funil.
- Manter um catálogo de serviços.
- Registrar interesses (cliente x serviço).
- Prover visão inicial de pipeline e engajamento.

Abordagem: Entregas verticais por valor (login → clientes → pipeline/stages → serviços/interesses → relatórios), evitando “CRUDs isolados”.

---

## 2. Domínio e Entidades

### Entidades Principais (MVP)
- **User**: funcionário (auth, roles).
- **Client**: dados básicos + estágio (stage/step).
- **Step (Stage)**: etapas do funil (Lead, Qualificado, Proposta, Fechado).
- **Service**: catálogo de serviços.
- **Interest**: relação N:N Client ↔ Service (metadados simples).

### Possíveis Extensões Futuras
- Notes / Interactions
- Tasks / Follow-ups  
- Audit Trail avançado
- Relatórios de conversão
- Tags / Segmentação
- Exportações e notificações

---

## 5. Backlog Inicial (User Stories)

### Core
1. Como funcionário quero fazer login para acessar o sistema.
2. Como admin quero criar/gerenciar usuários para controlar acesso.
3. Como funcionário quero cadastrar um novo cliente para iniciar acompanhamento.
4. Como funcionário quero ver uma lista filtrável de clientes para localizar rapidamente.
5. Como funcionário quero visualizar detalhes de um cliente (dados + estágio).
6. Como funcionário quero atualizar o estágio de um cliente no funil.
7. Como funcionário quero gerenciar o catálogo de serviços.
8. Como funcionário quero associar serviços de interesse a um cliente.
9. Como funcionário quero pesquisar clientes por nome/email.
10. Como funcionário quero sair (logout) para encerrar a sessão.

(Reordenado para refletir prioridade de estágio antes de interesses.)

### Suporte / Técnico
11. Como desenvolvedor quero pipeline CI/CD básico.
12. Como desenvolvedor quero logs estruturados para diagnóstico.
13. Como admin quero roles (admin vs user) para restringir operações.
14. Como compliance quero timestamps de criação/alteração.

### Futuro / Estendido
15. Como gestor quero relatório de clientes por estágio.
16. Como gestor quero ver serviços mais demandados (interesses).
17. Como funcionário quero adicionar notas de contato.
18. Como funcionário quero marcar follow-ups/tarefas.

---

## 6. Planejamento de Sprints (Sugerido - 2 semanas cada)

### Sprint 0 (Setup / Pré)
Objetivo: Fundamento técnico.
- Definir arquitetura pastas (Backend + Front).
- Docker Compose (API + DB).
- Repositório(s) + Git hooks + lint/format (ESLint, Prettier, EditorConfig, .NET analyzers).
- Modelo inicial: User, Client, Step, Service (rasa), Interest (placeholder).
- Decisão de auth (Identity + JWT ou NextAuth com provider custom).
- Swagger configurado.
Entregável: Ambiente local rodando.

### Sprint 1 (Autenticação e Usuários)
Stories: 1, 2, 11 (parcial), 13 (parcial).  
Backend:
- Entidade User + Roles (admin, user).
- Endpoints: login, refresh (se necessário), CRUD básico usuários (restrito).
Frontend:
- Tela Login.
- Layout autenticado (shell com nav).
- Página lista de usuários (CRUD mínimo).
Qualidade:
- Testes unitários AuthService e UserService.
- Swagger endpoints auth/users.
Resultado: Sistema acessível somente autenticado; admin seed.

### Sprint 2 (Clientes - Cadastro e Listagem)
Stories: 3, 4, 9, 14 (timestamps).  
Backend:
- Entidade Client (nome, email único, telefone, stageId opcional).
- Endpoints: create, list (paginação + filtro nome/email), get by id.
Frontend:
- Form criar cliente (validação Zod).
- Lista clientes com busca (debounce).
- Redirecionamento pós-login.
Qualidade:
- Testes integração: criar cliente, duplicidade email.
- Logging básico (id correlação).
Resultado: Gestão inicial de clientes funcionando (ainda com estágio placeholder / default).

### Sprint 3 (Pipeline / Stages + Segurança Base)
Stories: 5 (detalhe cliente incluindo estágio), 6 (atualizar estágio), 10 (logout), 13 (completar roles).  
Backend:
- Entidade Step (nome, ordem).
- CRUD leve de Steps (restrito admin) ou seed configurável.
- Endpoint para mudança de stage do cliente (opcional: histórico leve stage_changes).
Frontend:
- Página detalhe cliente agora mostrando estágio e permitindo alteração (dropdown / kanban simples).
- Visual inicial de pipeline (opção A: lista agrupada por stage; opção B: board drag & drop mínimo se couber).
- Logout explícito (limpeza tokens / sessão).
Qualidade:
- Testes de autorização (apenas user autenticado altera estágio; admin gerencia steps).
- E2E básico (login → criar cliente → mudar stage).
Resultado: Funil/kanban funcional antes dos interesses; valor operacional adiantado.

### Sprint 4 (Serviços e Interesses)
Stories: 7 (catálogo serviços), 8 (associar interesses; renumerado para manter backlog original), 5 (detalhe cliente agora inclui interesses também – extensão).  
Backend:
- Entidade Service (nome, descrição, ativo).
- Entidade Interest (clientId, serviceId, createdAt).
- Endpoints: CRUD Service, add/remove interest, listar interesses do cliente.
Frontend:
- Aba ou seção “Interesses” no detalhe do cliente.
- CRUD simples de Serviços (admin).
- UI associação (select múltiplo / autocomplete).
Qualidade:
- Índice único (clientId, serviceId) para evitar duplicação.
Resultado: Enriquecimento de dados do pipeline com interesses estratégicos.

### Sprint 5 (Relatórios Iniciais / Dashboard)
Stories: 15 (pipeline), 16 (interesses).  
Backend:
- Endpoints agregados: contagem de clientes por stage, top serviços por interesse.
Frontend:
- Dashboard simples (gráficos).
- Filtro por período (createdAt).
Resultado: Primeiros insights operacionais.

### Backlog Pós-Sprint 5 (Refinar)
- Notas (17)
- Follow-ups/Tarefas (18)
- Exportações (CSV)
- Notificações (email/webhook)
- Roles adicionais (read-only)
- Tags/Segmentação
- Melhorias UX / Design System

---

## 7. Exemplo de Quebra de História (Sprint 2 – “Cadastrar Cliente”)

História: “Como funcionário quero cadastrar um novo cliente para iniciar acompanhamento.”

Critérios de Aceitação:
- Ao salvar cliente válido, aparece na lista imediatamente.
- E-mail duplicado retorna erro claro.
- Busca por parte do nome encontra o cliente.

Tarefas Backend:
- Criar entidade + migration.
- DTOs (CreateClientRequest, ClientResponse).
- Service (regra e-mail único).
- Controller (POST /clients, GET /clients).
- Teste unitário (validação).
- Teste integração (criação e duplicidade).

Tarefas Frontend:
- Form (React Hook Form + Zod).
- Mutação via React Query + invalidação lista.
- Lista com busca (debounce 300ms).
- Toast de sucesso/erro.
- Teste de componente (render + submit).

Infra/Outros:
- Seed opcional de clientes fake (dev).

(Observação: Campo stageId pode iniciar null ou default e ser populado na Sprint 3.)

---

## Nota sobre Impacto da Reordenação
Benefícios:
- Usuários obtêm rapidamente visual de avanço (valor gerencial).
- Decisões sobre quais serviços priorizar podem vir depois com dados iniciais de progressão de clientes.
Cuidados:
- No Sprint 3, garantir que detalhe do cliente já tenha estrutura extensível para inserir aba de interesses depois sem refatoração pesada (ex.: tabs / sections modulares).
- Planejar DTO de ClientDetail prevendo campo interests vazio (para não quebrar front ao adicionar depois).

