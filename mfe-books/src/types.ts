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
  authorId: string;
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
