import { useState, useEffect, useCallback } from "react";
import type { Book } from "../../../types";

interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  error: string | null;
}

export const useBooks = (): UseBooksReturn => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error(`Erro ${res.status} ao carregar livros`);
      setBooks(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  return { books, loading, error };
};
