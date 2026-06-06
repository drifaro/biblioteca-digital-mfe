import { useBooks } from "./hooks/useBooks";
import { useAuthors } from "./hooks/useAuthors";
import { useBooksPage } from "./hooks/useBooksPage";
import { BookTable } from "./components/BookTable";
import { BookModal } from "./components/BookModal";
import { BookDeleteModal } from "./components/BookDeleteModal";
import styles from "./BooksPage.module.css";
import Pagination from "mfe_shared/Pagination";
import SearchBar from "mfe_shared/SearchBar";
import StatCard from "mfe_shared/StatCard";
import PlusIcon from "mfe_shared/PlusIcon";

export const BooksPage = () => {
  const { books, loading, error, createBook, updateBook, deleteBook } =
    useBooks();
  const { authors } = useAuthors();

  const {
    search,
    filterGenre,
    filterAuthor,
    genres,
    setSearch,
    setFilterGenre,
    setFilterAuthor,
    currentPage,
    totalFiltered,
    itemsPerPage,
    paginated,
    setCurrentPage,
    modal,
    form,
    setForm,
    openAdd,
    openEdit,
    openDelete,
    closeModal,
    authorName,
  } = useBooksPage(books, authors);

  const genreCount: Record<string, number> = {};
  books.forEach((b) => {
    if (b.genre) genreCount[b.genre] = (genreCount[b.genre] ?? 0) + 1;
  });
  const topGenre =
    Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const handleSave = async () => {
    const payload = {
      title: form.title.trim(),
      authorId: Number(form.authorId),
      year: form.year ? Number(form.year) : null,
      genre: form.genre || null,
      isbn: form.isbn.trim() || null,
    };
    if (modal?.mode === "add") await createBook(payload);
    if (modal?.mode === "edit") await updateBook(modal.book.id, payload);
    closeModal();
  };

  const handleDelete = async () => {
    if (modal?.mode !== "delete") return;
    await deleteBook(modal.book.id);
    closeModal();
  };

  if (loading)
    return (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--color-text-3)",
        }}
      >
        Carregando livros…
      </div>
    );
  if (error)
    return (
      <div
        style={{
          padding: "2rem",
          color: "var(--color-danger-light)",
          background: "var(--color-danger-bg)",
          borderRadius: "var(--radius-md)",
        }}
      >
        Erro ao carregar livros: {error}
      </div>
    );

  return (
    <section>
      <div className={styles.moduleHeader}>
        <div>
          <h1 className={styles.moduleTitle}>Acervo de Livros</h1>
          <p className={styles.moduleSubtitle}>
            Gerencie o catálogo completo da biblioteca
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <PlusIcon /> Cadastrar Livro
        </button>
      </div>

      <div className={styles.statsRow}>
        <StatCard
          label="Total de Livros"
          value={books.length}
          sub="no acervo"
        />
        <StatCard
          label="Gêneros"
          value={Object.keys(genreCount).length}
          sub="categorias"
        />
        <StatCard
          label="Mais Popular"
          value={topGenre}
          sub="por quantidade"
          smallValue
        />
        <StatCard label="Autores" value={authors.length} sub="cadastrados" />
      </div>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Buscar por título, autor ou ISBN…"
        filters={[
          {
            value: filterGenre,
            placeholder: "Todos os gêneros",
            options: genres.map((g) => ({ value: g, label: g })),
            onChange: setFilterGenre,
          },
          {
            value: filterAuthor,
            placeholder: "Todos os autores",
            options: authors.map((a) => ({
              value: String(a.id),
              label: a.name,
            })),
            onChange: setFilterAuthor,
          },
        ]}
      />

      <BookTable
        books={paginated}
        authors={authors}
        hasFilters={!!(search || filterGenre || filterAuthor)}
        authorName={authorName}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={totalFiltered}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        label="livros"
      />

      {modal?.mode === "add" && (
        <BookModal
          mode="add"
          form={form}
          setForm={setForm}
          authors={authors}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      {modal?.mode === "edit" && (
        <BookModal
          mode="edit"
          form={form}
          setForm={setForm}
          authors={authors}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      {modal?.mode === "delete" && (
        <BookDeleteModal
          book={modal.book}
          authorName={authorName(modal.book.authorId)}
          onConfirm={handleDelete}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default BooksPage;
