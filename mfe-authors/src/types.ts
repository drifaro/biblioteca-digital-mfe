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

export interface AuthorFormState {
  name: string;
  nationality: string;
  birthYear: string;
}

export type AuthorFormErrors = Partial<Record<keyof AuthorFormState, string>>;

export type CreateAuthorPayload = Omit<Author, "id">;
export type UpdateAuthorPayload = Partial<Omit<Author, "id">>;

export const NATIONALITIES = [
  "Brasileira",
  "Portuguesa",
  "Americana",
  "Britânica",
  "Francesa",
  "Alemã",
  "Espanhola",
  "Italiana",
  "Argentina",
  "Colombiana",
  "Chilena",
  "Russa",
  "Japonesa",
  "Outra",
] as const;
