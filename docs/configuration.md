# Configuração

Este documento detalha as configurações do projeto.

## Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta `tantto-web/`:

```env
# URL da API backend (obrigatório)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Configuração NextAuth (obrigatório)
NEXTAUTH_SECRET=chave-secreta-para-jwt
NEXTAUTH_URL=http://localhost:3000
```

| Variável | Tipo | Obrigatório | Descrição |
|----------|------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | string | Sim | URL base da API backend |
| `NEXTAUTH_SECRET` | string | Sim | Chave secreta para assinar tokens JWT |
| `NEXTAUTH_URL` | string | Sim | URL do frontend para callbacks |

## Arquivos de Configuração

### `config/auth.ts`

Configuração do NextAuth com CredentialsProvider:

- **Estratégia de sessão:** JWT
- **Duração da sessão:** 24 horas
- **Provider:** Credentials (email/senha)

### `config/getQueryClient.tsx`

Fábrica de QueryClient para TanStack Query.

### `next.config.ts`

Configurações do Next.js (imagens, redirects, etc).

### `eslint.config.mjs`

Regras de linting com ESLint.

### `postcss.config.mjs`

Configuração do PostCSS para Tailwind CSS.

### `tsconfig.json`

Configuração TypeScript com paths aliases:

```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

## Providers Globais

Em `providers/Providers.tsx`, a hierarquia é:

```
SessionProvider (NextAuth)
  └── AuthProvider (Context de autenticação)
        └── QueryProvider (TanStack Query)
              └── {children}
```