# Hooks

## Hooks de Dados

Cada MFE é dono dos seus próprios hooks de dados — não há hooks compartilhados via
mfe-shared. Isso garante a autonomia de cada módulo.

---

### useBooks (mfe-books)

Localização: `mfe-books/src/features/books/hooks/useBooks.ts`

CRUD completo de livros. Após o fetch inicial, dispara o Custom Event
`mfe:books:loaded` com a contagem — consumido pelo container para atualizar
o badge do Header.

```typescript
const {
  books, // Book[]
  loading, // boolean
  error, // string | null
  createBook, // (payload: CreateBookPayload) => Promise<Book>
  updateBook, // (id: number, payload: UpdateBookPayload) => Promise<Book>
  deleteBook, // (id: number) => Promise<void>
  refetch, // () => void
} = useBooks();
```

**Custom Event disparado:**

```ts
window.dispatchEvent(
  new CustomEvent("mfe:books:loaded", { detail: { count: data.length } }),
);
```

---

### useAuthors (mfe-books)

Localização: `mfe-books/src/features/books/hooks/useAuthors.ts`

Somente leitura — o mfe-books precisa da lista de autores para o select de cadastro
de livros e para exibir os avatares na tabela. Não expõe funções de mutação.

```typescript
const {
  authors, // Author[]
  loading, // boolean
  error, // string | null
} = useAuthors();
```

---

### useAuthors (mfe-authors)

Localização: `mfe-authors/src/features/authors/hooks/useAuthors.ts`

CRUD completo de autores. Após o fetch inicial, dispara o Custom Event
`mfe:authors:loaded` com a contagem.

```typescript
const {
  authors,
  loading,
  error,
  createAuthor, // (payload: CreateAuthorPayload) => Promise<Author>
  updateAuthor, // (id: number, payload: UpdateAuthorPayload) => Promise<Author>
  deleteAuthor, // (id: number) => Promise<void>
  refetch,
} = useAuthors();
```

---

### useBooks (mfe-authors)

Localização: `mfe-authors/src/features/authors/hooks/useBooks.ts`

Somente leitura — o mfe-authors precisa da lista de livros para calcular a
contagem de livros por autor exibida na tabela.

```typescript
const {
  books, // Book[]
  loading, // boolean
  error, // string | null
} = useBooks();
```

---

## Hooks de Página

Encapsulam a lógica de UI de cada feature: filtros, paginação e estado do modal.
As páginas ficam responsáveis apenas pela renderização.

---

### useBooksPage

Localização: `mfe-books/src/features/books/hooks/useBooksPage.ts`

```typescript
const {
  // Filtros
  search,
  filterGenre,
  filterAuthor,
  genres,
  setSearch,
  setFilterGenre,
  setFilterAuthor,

  // Paginação
  currentPage,
  totalFiltered,
  itemsPerPage,
  paginated,
  setCurrentPage,

  // Modal
  modal, // { mode: "add" } | { mode: "edit"; book } | { mode: "delete"; book } | null
  form, // BookFormState
  setForm,
  openAdd,
  openEdit,
  openDelete,
  closeModal,

  // Helper
  authorName, // (id: number) => string
} = useBooksPage(books, authors);
```

---

### useAuthorsPage

Localização: `mfe-authors/src/features/authors/hooks/useAuthorsPage.ts`

```typescript
const {
  search,
  filterNat,
  nationalities,
  setSearch,
  setFilterNat,
  currentPage,
  totalFiltered,
  itemsPerPage,
  paginated,
  setCurrentPage,
  modal, // { mode: "add" } | { mode: "edit"; author } | { mode: "delete"; author } | null
  form, // AuthorFormState
  setForm,
  openAdd,
  openEdit,
  openDelete,
  closeModal,
} = useAuthorsPage(authors);
```

---

## Comunicação entre MFEs — Custom Events

MFEs são isolados por design e não importam uns dos outros. Para comunicar a contagem
de registros ao Header (que vive no mfe-shared e é orquestrado pelo container),
o projeto usa **Custom Events do browser**.

### Fluxo completo

```
mfe-books monta
  └── useBooks() executa fetch /api/books
        └── dispara "mfe:books:loaded" com { count: N }

mfe-authors monta (quando usuário navega para a aba)
  └── useAuthors() executa fetch /api/authors
        └── dispara "mfe:authors:loaded" com { count: N }

container/App.tsx
  ├── no mount: fetch /api/books e /api/authors para counts iniciais
  │   (garante que o Header exiba valores corretos antes dos MFEs montarem)
  ├── escuta "mfe:books:loaded" → atualiza bookCount
  ├── escuta "mfe:authors:loaded" → atualiza authorCount
  └── passa bookCount e authorCount como props para o Header
```

### Por que o container faz fetch inicial?

O `AuthorsPage` só monta quando o usuário navega para a aba de autores. Sem o fetch
inicial no container, o `authorCount` ficaria em `0` até a primeira navegação. O container
busca os counts de forma independente logo ao montar, garantindo que o Header exiba
os valores corretos desde o início.

### Implementação no container

```tsx
// container/src/App.tsx
useEffect(() => {
  // Fetch inicial — independente de qual MFE está ativo
  fetch("/api/books")
    .then((r) => r.json())
    .then((d) => setBookCount(d.length));
  fetch("/api/authors")
    .then((r) => r.json())
    .then((d) => setAuthorCount(d.length));

  // Escuta atualizações após operações de CRUD
  const onBooks = (e: Event) =>
    setBookCount((e as CustomEvent<{ count: number }>).detail.count);
  const onAuthors = (e: Event) =>
    setAuthorCount((e as CustomEvent<{ count: number }>).detail.count);

  window.addEventListener("mfe:books:loaded", onBooks);
  window.addEventListener("mfe:authors:loaded", onAuthors);

  return () => {
    window.removeEventListener("mfe:books:loaded", onBooks);
    window.removeEventListener("mfe:authors:loaded", onAuthors);
  };
}, []);
```
