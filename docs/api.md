# API e Serviços

Este documento descreve a integração do frontend com o backend.

## Configuração Base

O cliente HTTP está em `services/api.ts`:

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

O token JWT é adicionado automaticamente via interceptor.

## Endpoints do Backend

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/Auth/login` | Login de usuário |

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123!"
}
```

**Response:**
```json
{
  "token": "eyJhbG...",
  "userId": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "role": "admin",
  "message": "Login realizado com sucesso"
}
```

### Kanban

| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|----------|
| GET | `/CompanyCard/cards/grouped` | Listar colunas com cards | `get-all-columns.ts` |
| POST | `/CompanyCard` | Criar card de empresa | `create-company-card.ts` |
| POST | `/StepColumn` | Criar coluna | `create-step-column.ts` |

## Serviços Disponíveis

### `services/auth/login.ts`

```typescript
export async function Login(data: LoginData): Promise<AxiosResponse<LoginResponse>> {
  return await api.post<LoginResponse>(`Auth/login`, data);
}
```

### `services/kanban/get-all-columns.ts`

```typescript
export const getAllColumns = async () => {
  const response = await api.get("CompanyCard/cards/grouped");
  return response.data;
}
```

## Tipos de Dados

### LoginResponse (`types/auth.ts`)

```typescript
interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  message: string;
}
```

### KanbanCard (`components/kanban/useKanbanData.ts`)

```typescript
type KanbanCard = {
  id: string;
  name: string;
  title: string;
  description: string;
  priority: "Alta Prioridade" | "Média Prioridade" | "Baixa Prioridade";
  column: string;
  stepColumnId: string;
  avatars: string[];
};
```

### KanbanColumn

```typescript
type KanbanColumn = {
  id: string;
  name: string;
  color: string;
  cards: KanbanCard[];
};
```

## Hook useKanbanData

Gerencia dados do Kanban com TanStack Query:

```typescript
const { columns, addCard, addColumn, isLoadingColumns } = useKanbanData();
```

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `columns` | `KanbanColumn[]` | Lista de colunas |
| `addCard` | `UseMutationResult` | Mutation para criar card |
| `addColumn` | `UseMutationResult` | Mutation para criar coluna |
| `isLoadingColumns` | `boolean` | Estado de loading |