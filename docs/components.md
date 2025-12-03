# Componentes

Este documento detalha os principais componentes do projeto.

## Componentes UI (`components/ui/`)

Componentes base construídos com Radix UI + Tailwind CSS.

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Button | `button.tsx` | Botão com variantes (primary, secondary, etc) |
| Input | `input.tsx` | Campo de input com suporte a ícones e erros |
| Dialog | `dialog.tsx` | Modal/Dialog acessível |
| Select | `select.tsx` | Dropdown seletor |
| Card | `card.tsx` | Container de conteúdo |
| Badge | `badge.tsx` | Etiquetas/tags |
| Avatar | `avatar.tsx` | Imagem de perfil |
| ScrollArea | `scroll-area.tsx` | Área com scroll customizado |

## Componentes de Layout (`components/layout/`)

### Sidebar

```tsx
import Sidebar from "@/components/layout/Sidebar";
```

Menu lateral fixo com:
- Logo da Tantto
- Links de navegação (Prospeção, Empresas, Clientes, Serviços)
- Informações do usuário logado
- Botão de logout

**Seções do menu:**

| Label | Ícone | Rota |
|-------|-------|------|
| Prospeção | Network | `/prospection` |
| Empresas | Building2 | `/companies` |
| Clientes | Users | `/clients` |
| Serviços | FileText | `/services` |

## Componentes Kanban (`components/kanban/`)

### KanbanProvider

Provider principal que gerencia estado do Kanban com drag-and-drop.

```tsx
<KanbanProvider columns={columns} data={cards}>
  {(column) => (
    <KanbanBoard key={column.id} id={column.id}>
      {/* ... */}
    </KanbanBoard>
  )}
</KanbanProvider>
```

### KanbanBoard

Container de uma coluna do Kanban.

```tsx
<KanbanBoard id={column.id} className="min-w-[340px]">
  <KanbanColumnHeader column={column} onAddCard={() => {}} />
  <KanbanCards id={column.id}>
    {(item) => <KanbanCard {...item} />}
  </KanbanCards>
</KanbanBoard>
```

### KanbanCard

Card draggable dentro de uma coluna.

### KanbanColumnHeader (`KanbanColumnHeader.tsx`)

Cabeçalho da coluna com:
- Nome e cor da coluna
- Contagem de cards
- Botão de adicionar card

### KanbanCardItem (`KanbanCardItem.tsx`)

Conteúdo visual do card:
- Título
- Descrição
- Badge de prioridade
- Avatares dos responsáveis

### KanbanCardDialog (`KanbanCardDialog.tsx`)

Modal para criar/editar um card:
- Título
- Descrição
- Prioridade (Alta, Média, Baixa)

### KanbanColumnDialog (`KanbanColumnDialog.tsx`)

Modal para criar uma coluna:
- Nome da coluna
- Cor

## Componentes Comuns (`components/common/`)

### AsyncBoundary

Wrapper para estados de loading/error/success:

```tsx
<AsyncBoundary
  isLoading={isLoading}
  isFetching={isFetching}
  isError={isError}
  data={data}
>
  {(data) => <Component data={data} />}
</AsyncBoundary>
```

## Hook useKanbanData

Hook customizado para gerenciar dados do Kanban:

```tsx
const {
  columns,        // KanbanColumn[]
  addCard,        // UseMutationResult
  addColumn,      // UseMutationResult
  isLoadingColumns,
  isFetchingColumns,
  isErrorColumns,
} = useKanbanData();
```

### Mutations

**addCard:**
```typescript
addCard.mutate({
  companyId: "uuid",
  stepColumnId: "uuid",
});
```

**addColumn:**
```typescript
addColumn.mutateAsync({
  name: "Nova Etapa",
  color: "#00c461",
  order: 3,
});
```
