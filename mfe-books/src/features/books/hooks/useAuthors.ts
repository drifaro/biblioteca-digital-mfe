import { useState, useEffect } from "react";
import type { Author } from "../../../types";

interface UseAuthorsReturn {
  authors: Author[];
  loading: boolean;
  error: string | null;
}

export const useAuthors = (): UseAuthorsReturn => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/authors")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status} ao carregar autores`);
        return res.json() as Promise<Author[]>;
      })
      .then((data) => {
        setAuthors(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setLoading(false);
      });
  }, []);

  return { authors, loading, error };
};
