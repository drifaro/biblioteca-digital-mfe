// Hook de página — encapsula toda a lógica de UI da BooksPage:
// filtros, paginação e estado do modal.
// A BooksPage fica responsável apenas pela renderização.

import { useEffect, useMemo, useState } from "react";
import type { Book, Author, BookFormState } from "../../../types";

const ITEMS_PER_PAGE = 6;

const EMPTY_FORM: BookFormState = {
  title: "",
  authorId: "",
  year: "",
  genre: "",
  isbn: "",
};

export type BookModalState =
  | { mode: "add" }
  | { mode: "edit"; book: Book }
  | { mode: "delete"; book: Book }
  | null;

interface UseBooksPageReturn {
  // Filtros
  search: string;
  filterGenre: string;
  filterAuthor: string;
  genres: string[];
  setSearch: (v: string) => void;
  setFilterGenre: (v: string) => void;
  setFilterAuthor: (v: string) => void;

  // Paginação
  currentPage: number;
  totalFiltered: number;
  itemsPerPage: number;
  paginated: Book[];
  setCurrentPage: (page: number) => void;

  // Modal
  modal: BookModalState;
  form: BookFormState;
  setForm: React.Dispatch<React.SetStateAction<BookFormState>>;
  openAdd: () => void;
  openEdit: (book: Book) => void;
  openDelete: (book: Book) => void;
  closeModal: () => void;

  // Helpers
  authorName: (id: number) => string;
}

export const useBooksPage = (books: Book[], authors: Author[]): UseBooksPageReturn => {
  const [search, setSearchRaw]         = useState("");
  const [filterGenre, setFilterGenreRaw]   = useState("");
  const [filterAuthor, setFilterAuthorRaw] = useState("");
  const [currentPage, setCurrentPage]  = useState(1);
  const [modal, setModal]              = useState<BookModalState>(null);
  const [form, setForm]                = useState<BookFormState>(EMPTY_FORM);

  // Resetar página ao mudar filtros
  const setSearch      = (v: string) => { setSearchRaw(v);      setCurrentPage(1); };
  const setFilterGenre = (v: string) => { setFilterGenreRaw(v); setCurrentPage(1); };
  const setFilterAuthor = (v: string) => { setFilterAuthorRaw(v); setCurrentPage(1); };

  const genres = useMemo(
    () => [...new Set(books.map((b) => b.genre).filter(Boolean))].sort() as string[],
    [books],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return books.filter((b) => {
      const author = authors.find((a) => a.id === b.authorId);
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        author?.name.toLowerCase().includes(q) ||
        b.isbn?.includes(q);
      const matchGenre  = !filterGenre  || b.genre === filterGenre;
      const matchAuthor = !filterAuthor || String(b.authorId) === filterAuthor;
      return matchSearch && matchGenre && matchAuthor;
    });
  }, [books, authors, search, filterGenre, filterAuthor]);

  // Garantir que a página corrente não ultrapasse o total
  const totalPages     = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  useEffect(() => {
    if (currentPage !== safeCurrentPage) setCurrentPage(safeCurrentPage);
  }, [currentPage, safeCurrentPage]);

  const paginated = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safeCurrentPage]);

  // Modal
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  };

  const openEdit = (book: Book) => {
    setForm({
      title:    book.title,
      authorId: String(book.authorId),
      year:     book.year  != null ? String(book.year)  : "",
      genre:    book.genre ?? "",
      isbn:     book.isbn  ?? "",
    });
    setModal({ mode: "edit", book });
  };

  const openDelete = (book: Book) => setModal({ mode: "delete", book });
  const closeModal  = ()           => setModal(null);

  const authorName = (id: number) =>
    authors.find((a) => a.id === id)?.name ?? "—";

  return {
    search, filterGenre, filterAuthor, genres,
    setSearch, setFilterGenre, setFilterAuthor,
    currentPage: safeCurrentPage, totalFiltered: filtered.length,
    itemsPerPage: ITEMS_PER_PAGE, paginated, setCurrentPage,
    modal, form, setForm, openAdd, openEdit, openDelete, closeModal,
    authorName,
  };
};
