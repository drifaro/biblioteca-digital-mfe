import { useState, useEffect, useCallback } from "react";
import type {
  Author,
  CreateAuthorPayload,
  UpdateAuthorPayload,
} from "../../../types";

interface UseAuthorsReturn {
  authors: Author[];
  loading: boolean;
  error: string | null;
  createAuthor: (payload: CreateAuthorPayload) => Promise<Author>;
  updateAuthor: (id: number, payload: UpdateAuthorPayload) => Promise<Author>;
  deleteAuthor: (id: number) => Promise<void>;
  refetch: () => void;
}

export const useAuthors = (): UseAuthorsReturn => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/authors");
        if (!res.ok) throw new Error(`Erro ${res.status} ao carregar autores`);
        const data = await res.json();
        if (!cancelled) {
          setAuthors(data);
          globalThis.dispatchEvent(
            new CustomEvent("mfe:authors:loaded", {
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

  const createAuthor = useCallback(
    async (payload: CreateAuthorPayload): Promise<Author> => {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(
          ((await res.json()) as { error: string }).error ??
            "Erro ao criar autor",
        );
      const created: Author = await res.json();
      setAuthors((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const updateAuthor = useCallback(
    async (id: number, payload: UpdateAuthorPayload): Promise<Author> => {
      const res = await fetch(`/api/authors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(
          ((await res.json()) as { error: string }).error ??
            "Erro ao atualizar autor",
        );
      const updated: Author = await res.json();
      setAuthors((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    },
    [],
  );

  const deleteAuthor = useCallback(async (id: number): Promise<void> => {
    const res = await fetch(`/api/authors/${id}`, { method: "DELETE" });
    if (!res.ok)
      throw new Error(
        ((await res.json()) as { error: string }).error ??
          "Erro ao remover autor",
      );
    setAuthors((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    authors,
    loading,
    error,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    refetch,
  };
};
