# CRM Tantto Tecnologia

> Sistema de Customer Relationship Management desenvolvido para centralizar e otimizar a gestão comercial da **Tantto Tecnologia**.

---

##  Sobre o Projeto

O **CRM Tantto** é uma solução completa para gerenciamento de relacionamento com clientes, oferecendo funcionalidades de cadastro, acompanhamento visual via Kanban, gestão de serviços e geração de relatórios estratégicos.

###  Objetivos

- Centralizar o processo comercial da empresa
- Facilitar a gestão de leads e negociações
- Proporcionar visibilidade clara do funil de vendas
- Gerar insights através de relatórios e dashboards
- Otimizar o acompanhamento de oportunidades

---

##  Equipe de Desenvolvimento

- **Felipe Marques** – [felipemq100@gmail.com](mailto:felipemq100@gmail.com)
- **Gabriel Ribeiro** – [gabriel.dev09@gmail.com](mailto:gabriel.dev09@gmail.com) 
- **Giovana da Silva** – [giovanarafaela798@gmail.com](mailto:giovanarafaela798@gmail.com)
- **Tobias Alquezar** – [tobiasperassi@gmail.com](mailto:tobiasperassi@gmail.com)

---

##  Funcionalidades Principais

### Gestão de Empresas
- Cadastro completo de empresas (nome, CNPJ, setor, representante)
- Listagem e busca avançada de empresas
- Edição e visualização de detalhes
- Upload de logo/imagem da empresa

### Pipeline Kanban
- Visualização do funil de vendas em formato Kanban
- Cartões customizáveis por empresa
- Atualização de estágios através de drag & drop
- Priorização visual de negociações

### Gestão de Serviços
- Catálogo de serviços oferecidos
- Vinculação de serviços às empresas
- Controle de duração de contratos e valores
- Upload de imagens ilustrativas dos serviços

### Gestão de Clientes
- Cadastro de clientes vinculados às empresas
- Informações de contato completas
- Histórico de interações

### Sistema de Usuários
- Autenticação segura (Login/Logout)
- Controle de acesso baseado em perfis
- Cadastro e gerenciamento de usuários
- Foto de perfil personalizável

### Análises e Relatórios
- Previsão de probabilidade de fechamento
- Dashboards com métricas de vendas
- Relatórios por estágio do funil

---

##  Arquitetura do Sistema

### Modelo de Dados

O sistema é construído sobre 6 entidades principais:

#### 1. **UserModel**
- Gerenciamento de usuários do sistema
- Controle de autenticação e autorização
- Perfil e preferências do usuário

#### 2. **CompanyModel**
- Dados cadastrais das empresas
- Informações corporativas (CNPJ, setor)
- Relacionamento com clientes e cartões

#### 3. **ClientModel**
- Pessoas de contato das empresas
- Dados de comunicação
- Vinculação com empresas

#### 4. **ServiceModel**
- Catálogo de serviços oferecidos
- Descrição, valores e duração
- Documentação visual

#### 5. **CompanyCardModel**
- Representação visual no Kanban
- Prioridade e status da negociação
- Vinculação com empresa e estágio

#### 6. **StepColumnModel**
- Etapas do funil de vendas
- Ordenação e visualização
- Configuração de cores e status

### Relacionamentos
```
UserModel (1) ──── (N) CompanyCardModel
CompanyModel (1) ──── (N) ClientModel
CompanyModel (1) ──── (N) CompanyCardModel
CompanyModel (N) ──── (N) ServiceModel
StepColumnModel (1) ──── (N) CompanyCardModel
```

---

##  Stack Tecnológica

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

**Principais Bibliotecas:**
- **Next.js** - Framework React com SSR
- **TypeScript** - Tipagem estática
- **NextAuth** - Autenticação
- **Zod** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários
- **React Query** - Estado assíncrono e cache

### Backend
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)

**Arquitetura:**
- **.NET 8** com C#
- **Entity Framework Core** - ORM
- **Swagger** - Documentação de API
- **Arquitetura em camadas** (Controller → Service → Repository)
- **JWT** - Autenticação segura

### Banco de Dados
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

---

##  Estrutura do Projeto
```
crm-tantto/
├── frontend/
│   ├── src/
│   │   ├── app/              # Rotas Next.js
│   │   ├── components/       # Componentes React
│   │   ├── services/         # Chamadas API
│   │   ├── hooks/            # Custom hooks
│   │   ├── types/            # Tipos TypeScript
│   │   └── lib/              # Utilitários
│   └── public/               # Assets estáticos
│
├── backend/
│   ├── Controllers/          # Endpoints da API
│   ├── Services/             # Lógica de negócio
│   ├── Repositories/         # Acesso a dados
│   ├── Models/               # Entidades do domínio
│   ├── DTOs/                 # Data Transfer Objects
│   └── Migrations/           # Migrações do banco
│
└── docs/                     # Documentação técnica
```

---

##  Design e Prototipação

### Figma
O protótipo completo da interface está disponível no Figma, incluindo:
- Telas de autenticação
- Dashboard principal
- Visualização Kanban
- Formulários de cadastro
- Detalhamento de empresas

[ Acessar Protótipo no Figma](https://www.figma.com/design/T0y1W7rVJpisFfAbKueD99/Projeto-Integrador-2?node-id=0-1&t=v8jAjMGPzYxtSbLJ-1)

---

##  Fluxos de Uso

### 1. Autenticação
```
Login → Validação → Acesso ao Dashboard
```

### 2. Cadastro de Empresa
```
Formulário → Validação → Salvar → Listar Empresas
```

### 3. Gestão de Pipeline
```
Visualizar Kanban → Mover Card → Atualizar Estágio → Salvar
```

### 4. Associação de Serviços
```
Detalhe da Empresa → Adicionar Serviço → Configurar Contrato → Confirmar
```

---

##  Perfis de Usuário

### Vendedor
- Cadastrar e editar empresas
- Visualizar e atualizar Kanban
- Adicionar clientes e serviços
- Visualizar relatórios básicos

### Gestor
- Todas as permissões do Vendedor
- Acesso a relatórios avançados
- Análise de conversão
- Métricas de performance

### Administrador
- Todas as permissões do Gestor
- Gerenciar usuários do sistema
- Configurar estágios do funil
- Gerenciar catálogo de serviços
- Configurações globais do sistema

---

##  Planejamento de Desenvolvimento

### Sprint 0 - Setup (Concluída)
-  Configuração de repositórios
-  Ambiente Docker
-  Estrutura inicial do projeto
-  Configuração de CI/CD básico

### Sprint 1 - Autenticação e Usuários (Concluída)
-  Sistema de login/logout
-  Gestão de usuários
-  Controle de permissões
-  Layout autenticado

### Sprint 2 - Cadastro de Empresas (Em Progresso)
-  CRUD de empresas
-  Listagem com filtros
-  Busca avançada
-  Upload de imagens

### Sprint 3 - Pipeline Kanban (Planejada)
-  Visualização de estágios
-  Drag & drop de cards
-  Atualização de status
-  Gestão de prioridades

### Sprint 4 - Serviços e Vinculações (Planejada)
-  Catálogo de serviços
-  Associação empresa-serviço
-  Configuração de contratos
-  Gestão de interesses

### Sprint 5 - Relatórios e Analytics (Planejada)
-  Dashboard principal
-  Métricas de conversão
-  Previsão de fechamento
-  Exportação de dados

---

## Características de Qualidade

| Característica | Implementação |
|----------------|---------------|
| **Usabilidade** | Interface intuitiva, responsiva e acessível |
| **Confiabilidade** | Validações robustas, tratamento de erros, backups |
| **Desempenho** | Otimizações de queries, cache, lazy loading |
| **Segurança** | Autenticação JWT, validação de inputs, controle de acesso |
| **Manutenibilidade** | Código limpo, documentado, arquitetura em camadas |
| **Portabilidade** | Multiplataforma (web responsivo) |

---

## Restrições e Limitações

### Tecnológicas
- Uso exclusivo de tecnologias open source
- Sem dependência de hardware específico
- Hospedagem em infraestrutura de baixo custo

### Funcionais (Versão Atual)
- Sem integração com sistemas externos
- Sem funcionalidades de automação de marketing
- Relatórios básicos (expansível em versões futuras)

---

## Cronograma de Entregas

| Marco | Data | Status |
|-------|------|--------|
| Início da análise de requisitos | 11/08/2025 | ✅ Concluído |
| Protótipo de interface | 22/08/2025 | ✅ Concluído |
| Versão MVP funcional | 03/10/2025 | ✅ Concluído|
| Testes com usuários | 07/11/2025 | ✅ Concluído |
| Entrega final | 12/12/2025 | ✅ Concluído |

---

##  Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código
- Seguir convenções de nomenclatura do TypeScript/C#
- Utilizar ESLint e Prettier no frontend
- Utilizar analyzers do .NET no backend
- Documentar funções e componentes complexos
- Escrever testes para novas funcionalidades

---

##  Documentação Adicional

Para informações técnicas detalhadas, consulte a pasta [`docs/`](docs/):

- [Visão Geral](docs/overview.md)
- [Guia de Instalação](docs/getting-started.md)
- [Arquitetura do Sistema](docs/architecture.md)
- [Documentação de Componentes](docs/components.md)
- [API e Endpoints](docs/api.md)
- [Configuração de Ambiente](docs/configuration.md)
- [Guia de Contribuição](docs/contributing.md)

---

##  Licença

Este projeto é de uso interno da **Tantto Tecnologia** e foi desenvolvido como parte do programa de formação técnica da Escola SENAI.

---

##  Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato com a equipe de desenvolvimento ou com o representante da empresa:

**Tantto Tecnologia**  
Representante: Thiago Martins

---

<p align="center">
  Desenvolvido com 💙 pela equipe de alunos SENAI
</p>