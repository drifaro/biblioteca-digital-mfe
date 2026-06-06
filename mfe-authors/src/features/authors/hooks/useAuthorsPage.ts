import { useEffect, useMemo, useState } from "react";
import type { Author, AuthorFormState } from "../../../types";

const ITEMS_PER_PAGE = 6;

const EMPTY_FORM: AuthorFormState = { name: "", nationality: "", birthYear: "" };

export type AuthorModalState =
  | { mode: "add" }
  | { mode: "edit"; author: Author }
  | { mode: "delete"; author: Author }
  | null;

interface UseAuthorsPageReturn {
  search: string;
  filterNat: string;
  nationalities: string[];
  setSearch: (v: string) => void;
  setFilterNat: (v: string) => void;

  currentPage: number;
  totalFiltered: number;
  itemsPerPage: number;
  paginated: Author[];
  setCurrentPage: (page: number) => void;

  modal: AuthorModalState;
  form: AuthorFormState;
  setForm: React.Dispatch<React.SetStateAction<AuthorFormState>>;
  openAdd: () => void;
  openEdit: (author: Author) => void;
  openDelete: (author: Author) => void;
  closeModal: () => void;
}

export const useAuthorsPage = (authors: Author[]): UseAuthorsPageReturn => {
  const [search, setSearchRaw]     = useState("");
  const [filterNat, setFilterNatRaw] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal]           = useState<AuthorModalState>(null);
  const [form, setForm]             = useState<AuthorFormState>(EMPTY_FORM);

  const setSearch    = (v: string) => { setSearchRaw(v);    setCurrentPage(1); };
  const setFilterNat = (v: string) => { setFilterNatRaw(v); setCurrentPage(1); };

  const nationalities = useMemo(
    () => [...new Set(authors.map((a) => a.nationality).filter(Boolean))].sort() as string[],
    [authors],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return authors.filter((a) => {
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.nationality?.toLowerCase().includes(q);
      const matchNat = !filterNat || a.nationality === filterNat;
      return matchSearch && matchNat;
    });
  }, [authors, search, filterNat]);

  const totalPages      = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  useEffect(() => {
    if (currentPage !== safeCurrentPage) setCurrentPage(safeCurrentPage);
  }, [currentPage, safeCurrentPage]);

  const paginated = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safeCurrentPage]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  };

  const openEdit = (author: Author) => {
    setForm({
      name:        author.name,
      nationality: author.nationality  ?? "",
      birthYear:   author.birthYear != null ? String(author.birthYear) : "",
    });
    setModal({ mode: "edit", author });
  };

  const openDelete = (author: Author) => setModal({ mode: "delete", author });
  const closeModal  = ()               => setModal(null);

  return {
    search, filterNat, nationalities,
    setSearch, setFilterNat,
    currentPage: safeCurrentPage, totalFiltered: filtered.length,
    itemsPerPage: ITEMS_PER_PAGE, paginated, setCurrentPage,
    modal, form, setForm, openAdd, openEdit, openDelete, closeModal,
  };
};
