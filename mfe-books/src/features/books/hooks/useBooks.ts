import { useState, useEffect, useCallback } from "react";
import type {
  Book,
  CreateBookPayload,
  UpdateBookPayload,
} from "../../../types";

interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  error: string | null;
  createBook: (payload: CreateBookPayload) => Promise<Book>;
  updateBook: (id: number, payload: UpdateBookPayload) => Promise<Book>;
  deleteBook: (id: number) => Promise<void>;
  refetch: () => void;
}

export const useBooks = (): UseBooksReturn => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/books");
        if (!res.ok) throw new Error(`Erro ${res.status} ao carregar livros`);
        const data = await res.json();
        if (!cancelled) {
          setBooks(data);
          globalThis.dispatchEvent(
            new CustomEvent("mfe:books:loaded", {
              detail: { count: data.length },
            }),
          );
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [fetchCount]);

  const refetch = useCallback(() => setFetchCount((c) => c + 1), []);

  const createBook = useCallback(
    async (payload: CreateBookPayload): Promise<Book> => {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(
          ((await res.json()) as { error: string }).error ??
            "Erro ao criar livro",
        );
      const created: Book = await res.json();
      setBooks((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const updateBook = useCallback(
    async (id: number, payload: UpdateBookPayload): Promise<Book> => {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(
          ((await res.json()) as { error: string }).error ??
            "Erro ao atualizar livro",
        );
      const updated: Book = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    },
    [],
  );

  const deleteBook = useCallback(async (id: number): Promise<void> => {
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error(
        ((await res.json()) as { error: string }).error ??
          "Erro ao remover livro",
      );
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return {
    books,
    loading,
    error,
    createBook,
    updateBook,
    deleteBook,
    refetch,
  };
};
