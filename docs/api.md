# API (Mock)

Todas as rotas são interceptadas pelo **MSW (Mock Service Worker)**. A aplicação usa
`fetch` normalmente — não sabe que está falando com um mock.

**Latência simulada:** 300ms por requisição (configurável via `DELAY` em cada `handlers.ts`).

---

## Onde o MSW fica em cada pacote

| Pacote        | MSW ativo quando            | Observação                                                       |
| ------------- | --------------------------- | ---------------------------------------------------------------- |
| `container`   | **Sempre** (dev e produção) | Intercepta as chamadas dos MFEs carregados via Module Federation |
| `mfe-books`   | Apenas em `dev`             | Para rodar o MFE isolado sem o container                         |
| `mfe-authors` | Apenas em `dev`             | Idem                                                             |
| `mfe-shared`  | Nunca                       | Não tem lógica de dados                                          |

### Por que o MSW precisa estar no container?

O Service Worker só tem autoridade sobre a origem onde foi registrado. Como todos os MFEs
são carregados pelo container em `localhost:3000`, apenas o service worker registrado em
`:3000` consegue interceptar as requisições. Os MSWs individuais dos MFEs só funcionam
quando os MFEs rodam isoladamente em suas próprias portas.

---

## Endpoints — Livros

| Método   | Rota             | Descrição             | Status de sucesso |
| -------- | ---------------- | --------------------- | ----------------- |
| `GET`    | `/api/books`     | Lista todos os livros | `200`             |
| `GET`    | `/api/books/:id` | Busca livro por ID    | `200`             |
| `POST`   | `/api/books`     | Cria novo livro       | `201`             |
| `PUT`    | `/api/books/:id` | Atualiza livro        | `200`             |
| `DELETE` | `/api/books/:id` | Remove livro          | `204`             |

## Endpoints — Autores

| Método   | Rota               | Descrição              | Status de sucesso |
| -------- | ------------------ | ---------------------- | ----------------- |
| `GET`    | `/api/authors`     | Lista todos os autores | `200`             |
| `GET`    | `/api/authors/:id` | Busca autor por ID     | `200`             |
| `POST`   | `/api/authors`     | Cria novo autor        | `201`             |
| `PUT`    | `/api/authors/:id` | Atualiza autor         | `200`             |
| `DELETE` | `/api/authors/:id` | Remove autor           | `204`             |

---

## Payloads

### Book

```typescript
interface Book {
  id: number;
  title: string;
  authorId: number;
  year: number | null;
  genre: string | null;
  isbn: string | null;
}

type CreateBookPayload = Omit<Book, "id">;
type UpdateBookPayload = Partial<Omit<Book, "id">>;
```

### Author

```typescript
interface Author {
  id: number;
  name: string;
  nationality: string | null;
  birthYear: number | null;
  image?: string | null;
}

type CreateAuthorPayload = Omit<Author, "id">;
type UpdateAuthorPayload = Partial<Omit<Author, "id">>;
```

---

## Erros

Corpo padrão de erro (status 4xx):

```json
{ "error": "Mensagem descritiva do erro" }
```

| Status | Situação                                   |
| ------ | ------------------------------------------ |
| `400`  | Campo obrigatório ausente                  |
| `404`  | Recurso não encontrado                     |
| `422`  | `authorId` referencia um autor inexistente |

---

## Banco em Memória

**Arquivo:** `mocks/db.ts` (presente em cada pacote com MSW)

Os dados são resetados a cada reload da página. O banco é inicializado com
**20 autores** e **54 livros** cobrindo literatura Brasileira, Portuguesa,
Hispano-Americana, Europeia e Japonesa.

```typescript
// API de acesso
db.authors; // Author[]
db.books; // Book[]
db.findAuthor(id); // Author | undefined
db.findBook(id); // Book | undefined
db.addAuthor(author); // void
db.updateAuthor(id, patch); // Author | null
db.deleteAuthor(id); // boolean
db.addBook(book); // void
db.updateBook(id, patch); // Book | null
db.deleteBook(id); // boolean
db.nextId(); // number — baseado em Date.now()
```
