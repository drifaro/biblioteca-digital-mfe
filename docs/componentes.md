# Componentes

## Componentes Compartilhados (mfe-shared)

Localização: `mfe-shared/src/shared/components/`

São **agnósticos de domínio** — não conhecem `Book` nem `Author`. Reutilizáveis por
qualquer MFE presente ou futuro. Todos têm `export default` para compatibilidade com
o `React.lazy` do Module Federation.

Consumidos via Module Federation:

```ts
import Modal from "mfe_shared/Modal";
import SearchBar from "mfe_shared/SearchBar";
```

---

### Modal

Shell de modal usando o elemento `<dialog>` nativo. Gerencia abertura/fechamento e
clique no backdrop.

```typescript
interface ModalProps {
  title: string;
  onClose: () => void;
  footer: React.ReactNode; // botões de ação
  children: React.ReactNode; // corpo do modal
}
```

---

### SearchBar

Input de busca combinado com N filtros do tipo `<select>`.

```typescript
interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters?: FilterConfig[];
}

interface FilterConfig {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}
```

---

### StatCard

Card de métrica com label, valor e subtítulo opcional.

```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  smallValue?: boolean; // reduz font-size para textos longos
}
```

---

### EmptyState

Estado vazio de tabela com ícone configurável.

```typescript
interface EmptyStateProps {
  message: string;
  icon?: "book" | "person"; // padrão: "book"
}
```

---

### AuthorAvatar

Avatar circular com iniciais ou imagem do autor.

```typescript
interface AuthorAvatarProps {
  name: string;
  image?: string | null;
}
```

---

### Pagination

Paginação com ellipsis inteligente. Retorna `null` se os itens cabem em uma página.

```typescript
interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number; // padrão: 6
  onPageChange: (page: number) => void;
  label?: string; // padrão: "itens"
}
```

---

### Header

Cabeçalho da aplicação com navegação entre views. Recebe os counts via props — não
busca dados internamente. Os counts chegam via Custom Events disparados pelos MFEs
e gerenciados pelo container.

```typescript
interface HeaderProps {
  activeView: "books" | "authors";
  setActiveView: (view: "books" | "authors") => void;
  bookCount: number;
  authorCount: number;
}
```

---

### Footer

Rodapé estático com créditos e informações do projeto. Sem props.

---

## Ícones (mfe-shared)

Localização: `mfe-shared/src/shared/icons/`

Cada ícone é um componente React wrapper em sua própria pasta, com o SVG ao lado.
Todos têm `export default` para compatibilidade com Module Federation.

| Ícone        | Uso                           |
| ------------ | ----------------------------- |
| `BrandIcon`  | Logo da aplicação no Header   |
| `BooksIcon`  | Botão de navegação "Livros"   |
| `PersonIcon` | Botão de navegação "Autores"  |
| `PlusIcon`   | Botão "Cadastrar" nas páginas |
| `EditIcon`   | Botão de edição nas tabelas   |
| `TrashIcon`  | Botão de remoção nas tabelas  |
| `CloseIcon`  | Botão fechar do Modal         |
| `SearchIcon` | Ícone decorativo na SearchBar |

Consumidos via Module Federation:

```ts
import PlusIcon from "mfe_shared/PlusIcon";
import EditIcon from "mfe_shared/EditIcon";
import TrashIcon from "mfe_shared/TrashIcon";
```

---

## Componentes de Feature

### mfe-books

| Componente        | Responsabilidade                                        |
| ----------------- | ------------------------------------------------------- |
| `BooksPage`       | Página principal — orquestra todos os subcomponentes    |
| `BookTable`       | Tabela paginada de livros                               |
| `BookForm`        | Campos do formulário (title, author, year, genre, isbn) |
| `BookModal`       | Modal de cadastro e edição com validação                |
| `BookDeleteModal` | Modal de confirmação de remoção                         |

### mfe-authors

| Componente          | Responsabilidade                                     |
| ------------------- | ---------------------------------------------------- |
| `AuthorsPage`       | Página principal — orquestra todos os subcomponentes |
| `AuthorTable`       | Tabela paginada de autores com contagem de livros    |
| `AuthorForm`        | Campos do formulário (name, nationality, birthYear)  |
| `AuthorModal`       | Modal de cadastro e edição com validação             |
| `AuthorDeleteModal` | Modal de confirmação com aviso de livros vinculados  |

---

## Declarations de Tipos

Como o TypeScript não conhece módulos remotos em tempo de compilação, cada pacote
consumidor tem um `declarations.d.ts` que declara os tipos dos módulos do mfe-shared:

```typescript
// mfe-books/src/declarations.d.ts (exemplo)
declare module "mfe_shared/Modal" {
  import type { FC } from "react";
  const C: FC<{
    title: string;
    onClose: () => void;
    footer: React.ReactNode;
    children: React.ReactNode;
  }>;
  export default C;
}

declare module "mfe_shared/PlusIcon" {
  import type { FC, SVGProps } from "react";
  const C: FC<SVGProps<SVGSVGElement>>;
  export default C;
}
```
