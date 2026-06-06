# Tipos e Contratos

Diferente da versão monolítica (onde todos os tipos ficam em um único `types.ts`
centralizado), na arquitetura MFE **cada pacote é dono dos seus próprios tipos**.
Isso garante o isolamento e a autonomia de cada módulo.

---

## mfe-books — `src/types.ts`

Contém apenas os tipos necessários para a feature de livros. Tipos de Author são
incluídos porque o mfe-books precisa da entidade para exibir autores no select e avatares,
mas os payloads de mutação de autores (`CreateAuthorPayload`, `UpdateAuthorPayload`)
**não estão presentes** — o mfe-books nunca cria ou edita autores.

```typescript
export interface Author {
  id: number;
  name: string;
  nationality: string | null;
  birthYear: number | null;
  image?: string | null;
}

export interface Book {
  id: number;
  title: string;
  authorId: number;
  year: number | null;
  genre: string | null;
  isbn: string | null;
}

export interface BookFormState {
  title: string;
  authorId: string; // string porque vem de <select>
  year: string;
  genre: string;
  isbn: string;
}

export type BookFormErrors = Partial<Record<keyof BookFormState, string>>;
export type CreateBookPayload = Omit<Book, "id">;
export type UpdateBookPayload = Partial<Omit<Book, "id">>;

export const GENRES = [
  "Romance",
  "Ficção Científica",
  "Fantasia",
  "Conto",
  "Crônica",
  "Poesia",
  "Biografia",
  "Autobiografia",
  "Ensaio",
  "História",
  "Policial",
  "Terror",
  "Infantil",
  "Técnico",
  "Outro",
] as const;
```

---

## mfe-authors — `src/types.ts`

Análogo ao mfe-books. Tipos de Book são incluídos para leitura (contagem de livros
por autor), mas os payloads de mutação de livros (`CreateBookPayload`, `UpdateBookPayload`)
**não estão presentes**.

```typescript
export interface Author { ... }
export interface Book   { ... }

export interface AuthorFormState {
  name: string;
  nationality: string;
  birthYear: string;
}

export type AuthorFormErrors = Partial<Record<keyof AuthorFormState, string>>;
export type CreateAuthorPayload = Omit<Author, "id">;
export type UpdateAuthorPayload = Partial<Omit<Author, "id">>;

export const NATIONALITIES = [
  "Brasileira", "Portuguesa", "Americana", "Britânica", "Francesa",
  "Alemã", "Espanhola", "Italiana", "Argentina", "Colombiana",
  "Chilena", "Russa", "Japonesa", "Outra",
] as const;
```

---

## container — `src/types.ts`

Contém apenas os tipos necessários para o MSW do container (handlers e db).
O `App.tsx` do container não usa esses tipos diretamente.

```typescript
export interface Author { ... }
export interface Book   { ... }
export type CreateBookPayload   = Omit<Book, "id">;
export type UpdateBookPayload   = Partial<Omit<Book, "id">>;
export type CreateAuthorPayload = Omit<Author, "id">;
export type UpdateAuthorPayload = Partial<Omit<Author, "id">>;
```

---

## Comparação com o Monolítico

| Aspecto               | Monolítico            | MFE                                |
| --------------------- | --------------------- | ---------------------------------- |
| Localização dos tipos | `src/types.ts` único  | `src/types.ts` por pacote          |
| Tipos compartilhados  | Um arquivo central    | Duplicados onde necessário         |
| Adição de novo tipo   | 1 arquivo para editar | N arquivos (um por pacote afetado) |
| Isolamento            | Nenhum                | Total por módulo                   |

A duplicação de tipos entre pacotes é um trade-off consciente da arquitetura MFE.
A alternativa (um pacote de tipos compartilhado) adicionaria uma dependência de build
entre os projetos, reduzindo o isolamento.
