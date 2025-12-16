# Primeiros Passos

Guia rápido para rodar o projeto Tantto Web localmente.

## Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- Acesso à API backend (variável `NEXT_PUBLIC_API_URL`)

## 1. Clone o Repositório

```bash
git clone https://github.com/Projeto-integrador-tads2/front-end.git
cd front-end/tantto-web
```

## 2. Instale as Dependências

```bash
npm install
```

## 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta `tantto-web/`:

```env
# URL da API backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Configuração NextAuth
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=http://localhost:3000
```

## 4. Execute o Projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 5. Faça Login

1. Acesse `/auth/login`
2. Digite email e senha válidos
3. Após login, você será redirecionado para `/empresas` (Kanban)

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |

## Próximos Passos

- [Entenda a Arquitetura](architecture.md)
- [Conheça os Componentes](components.md)
- [Veja a documentação da API](api.md)