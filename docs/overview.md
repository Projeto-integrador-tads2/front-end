# Tantto Web — Visão Geral

O **Tantto Web** é um sistema de CRM (Customer Relationship Management) desenvolvido para a empresa Tantto Tecnologia. O objetivo é centralizar e otimizar a gestão comercial, permitindo o acompanhamento de leads, empresas e negociações através de uma interface visual Kanban.

## Funcionalidades Principais

| Funcionalidade | Descrição |
|----------------|-----------|
| **Kanban de Empresas** | Quadro visual para gerenciar o pipeline de prospecção e vendas |
| **Autenticação** | Login seguro com NextAuth + JWT |
| **Gestão de Colunas** | Criar e organizar etapas do funil de vendas |
| **Gestão de Cards** | Adicionar empresas/leads em cada etapa do Kanban |
| **Sidebar de Navegação** | Menu lateral com acesso rápido às seções |

## Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16.0.0 | Framework React com SSR |
| React | 19.2.0 | Biblioteca de UI |
| TypeScript | ^5 | Tipagem estática |
| NextAuth | ^4.24.12 | Autenticação |
| TanStack Query | ^5.90.5 | Gerenciamento de estado servidor |
| Tailwind CSS | ^4 | Estilização |
| Zod | ^4.1.12 | Validação de schemas |
| dnd-kit | ^6.3.1 | Drag and drop para Kanban |
| Axios | ^1.13.1 | Cliente HTTP |
| React Hook Form | ^7.65.0 | Formulários |
| Radix UI | vários | Componentes acessíveis |

## Estrutura de Pastas

```
tantto-web/
├── app/                    # Rotas e páginas (App Router)
│   ├── (private)/          # Rotas autenticadas
│   │   └── empresas/       # Página do Kanban
│   ├── (public)/           # Rotas públicas
│   │   └── auth/login/     # Página de login
│   └── api/auth/           # API Routes do NextAuth
├── components/             # Componentes React
│   ├── common/             # Componentes genéricos
│   ├── kanban/             # Componentes do Kanban
│   ├── layout/             # Sidebar e estrutura
│   └── ui/                 # Componentes base (Button, Input, etc)
├── config/                 # Configurações (auth, queryClient)
├── contexts/               # Contextos React (AuthContext)
├── lib/                    # Utilitários
├── providers/              # Providers globais
├── services/               # Chamadas de API
│   ├── auth/               # Serviço de login
│   └── kanban/             # Serviços do Kanban
├── types/                  # Tipos TypeScript
└── validators/             # Schemas Zod de validação
```

## Links da Wiki

- [Primeiros Passos](getting-started.md)
- [Arquitetura](architecture.md)
- [Componentes](components.md)
- [API e Serviços](api.md)
- [Configuração](configuration.md)
- [Contribuição](contributing.md)