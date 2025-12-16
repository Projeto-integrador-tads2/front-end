# Arquitetura do Projeto

Este documento descreve a arquitetura técnica do Tantto Web.

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────────┤
│  Providers (SessionProvider → AuthProvider → QueryProvider)  │
├─────────────────────────────────────────────────────────────┤
│  Layouts: RootLayout → PrivateLayout/PublicLayout           │
├─────────────────────────────────────────────────────────────┤
│  Pages: /empresas (Kanban) | /auth/login                    │
├─────────────────────────────────────────────────────────────┤
│  Services (Axios) ←→ Backend API                             │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Autenticação

1. Usuário acessa `/auth/login`
2. Formulário validado com **Zod** + **React Hook Form**
3. `AuthContext.logIn()` chama `signIn()` do NextAuth
4. NextAuth chama `services/auth/login.ts` → `POST /Auth/login`
5. Backend retorna `{ token, userId, name, email, role }`
6. Token salvo na sessão JWT
7. Usuário redirecionado para `/empresas`

## Gerenciamento de Estado

| Tipo | Ferramenta | Uso |
|------|------------|-----|
| Autenticação | NextAuth + Context | Sessão do usuário |
| Dados do Servidor | TanStack Query | Cache e fetch de dados |
| Formulários | React Hook Form | Validação e submit |
| Drag & Drop | dnd-kit | Kanban interativo |

## Estrutura de Rotas (App Router)

```
app/
├── layout.tsx              # Layout raiz com Providers
├── page.tsx                # Página inicial (/)
├── (private)/              # Grupo de rotas autenticadas
│   ├── layout.tsx          # Verifica sessão, exibe Sidebar
│   └── empresas/page.tsx   # Kanban principal
├── (public)/               # Grupo de rotas públicas
│   └── auth/login/page.tsx # Tela de login
└── api/auth/[...nextauth]/ # API Routes do NextAuth
```

## Camada de Serviços

Todas as chamadas HTTP passam por `services/api.ts`:

```typescript
// Interceptor automático de token
api.interceptors.request.use(async (request) => {
  const session = await getSession();
  if (session) {
    request.headers.Authorization = `Bearer ${session.token}`;
  }
  return request;
});
```

## Validação com Zod

Schemas em `validators/`:

- `login-schema.ts` — Validação de email/senha
- `kanban.ts` — Validação de cards e colunas

## Componentes UI

Baseados em **Radix UI** + **Tailwind CSS**:

- `components/ui/` — Button, Input, Dialog, Select, etc.
- `components/kanban/` — Kanban completo com drag-and-drop
- `components/layout/` — Sidebar de navegação