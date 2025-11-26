# Contribuindo

Guia para contribuir com o projeto Tantto Web.

## Fluxo de Trabalho

1. Clone o repositório
2. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feat/nome-da-feature
   ```
3. Faça suas alterações
4. Execute o lint:
   ```bash
   npm run lint
   ```
5. Commit com mensagem clara:
   ```bash
   git commit -m "feat: adiciona componente X"
   ```
6. Push e abra um Pull Request

## Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `style:` | Formatação |
| `refactor:` | Refatoração |
| `chore:` | Tarefas de manutenção |

## Padrões de Código

### Componentes React

- Use **function components** com TypeScript
- Props tipadas com `interface` ou `type`
- Arquivos em `PascalCase.tsx`

### Serviços

- Um arquivo por endpoint em `services/`
- Use tipos para request e response

### Validação

- Schemas Zod em `validators/`
- Export do type inferido: `export type X = z.infer<typeof xSchema>`

## Estrutura de Pastas

```
components/
├── ui/           # Componentes base reutilizáveis
├── kanban/       # Componentes específicos do Kanban
├── layout/       # Sidebar, headers
└── common/       # AsyncBoundary, etc
```

## Checklist de PR

- [ ] Código compila sem erros (`npm run build`)
- [ ] Lint passa (`npm run lint`)
- [ ] Testado localmente
- [ ] Documentação atualizada se necessário