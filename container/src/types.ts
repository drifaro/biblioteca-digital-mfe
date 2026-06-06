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

export type CreateBookPayload = Omit<Book, "id">;
export type UpdateBookPayload = Partial<Omit<Book, "id">>;

export type CreateAuthorPayload = Omit<Author, "id">;
export type UpdateAuthorPayload = Partial<Omit<Author, "id">>;
