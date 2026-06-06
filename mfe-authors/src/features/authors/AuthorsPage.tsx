import { useAuthors } from "./hooks/useAuthors";
import { useBooks } from "./hooks/useBooks";
import { useAuthorsPage } from "./hooks/useAuthorsPage";
import { AuthorTable } from "./components/AuthorTable";
import { AuthorModal } from "./components/AuthorModal";
import { AuthorDeleteModal } from "./components/AuthorDeleteModal";
import styles from "./AuthorsPage.module.css";
import Pagination from "mfe_shared/Pagination";
import SearchBar from "mfe_shared/SearchBar";
import StatCard from "mfe_shared/StatCard";
import PlusIcon from "mfe_shared/PlusIcon";
import type { CreateAuthorPayload } from "../../types";

export const AuthorsPage = () => {
  const { authors, loading, error, createAuthor, updateAuthor, deleteAuthor } =
    useAuthors();
  const { books } = useBooks();

  const {
    search,
    filterNat,
    nationalities,
    setSearch,
    setFilterNat,
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
  } = useAuthorsPage(authors);

  const natCounts: Record<string, number> = {};
  authors.forEach((a) => {
    if (a.nationality)
      natCounts[a.nationality] = (natCounts[a.nationality] ?? 0) + 1;
  });
  const bookCountFor = (id: number) =>
    books.filter((b) => b.authorId === id).length;

  const handleSave = async () => {
    const payload: CreateAuthorPayload = {
      name: form.name.trim(),
      nationality: form.nationality || null,
      birthYear: form.birthYear ? Number(form.birthYear) : null,
    };
    if (modal?.mode === "add") await createAuthor(payload);
    if (modal?.mode === "edit") await updateAuthor(modal.author.id, payload);
    closeModal();
  };

  const handleDelete = async () => {
    if (modal?.mode !== "delete") return;
    await deleteAuthor(modal.author.id);
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
        Carregando autores…
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
        Erro ao carregar autores: {error}
      </div>
    );

  return (
    <section>
      <div className={styles.moduleHeader}>
        <div>
          <h1 className={styles.moduleTitle}>Cadastro de Autores</h1>
          <p className={styles.moduleSubtitle}>
            Gerencie o registro de autores do acervo
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <PlusIcon /> Cadastrar Autor
        </button>
      </div>

      <div className={styles.statsRow}>
        <StatCard
          label="Total de Autores"
          value={authors.length}
          sub="cadastrados"
        />
        <StatCard
          label="Nacionalidades"
          value={Object.keys(natCounts).length}
          sub="distintas"
        />
        <StatCard
          label="Média de Livros"
          value={
            authors.length ? (books.length / authors.length).toFixed(1) : "0"
          }
          sub="por autor"
        />
        <StatCard
          label="Com Obras"
          value={authors.filter((a) => bookCountFor(a.id) > 0).length}
          sub="autores ativos"
        />
      </div>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Buscar por nome ou nacionalidade…"
        filters={[
          {
            value: filterNat,
            placeholder: "Todas as nacionalidades",
            options: nationalities.map((n) => ({ value: n, label: n })),
            onChange: setFilterNat,
          },
        ]}
      />

      <AuthorTable
        authors={paginated}
        books={books}
        hasFilters={!!(search || filterNat)}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={totalFiltered}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        label="autores"
      />

      {modal?.mode === "add" && (
        <AuthorModal
          mode="add"
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      {modal?.mode === "edit" && (
        <AuthorModal
          mode="edit"
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      {modal?.mode === "delete" && (
        <AuthorDeleteModal
          author={modal.author}
          bookCount={bookCountFor(modal.author.id)}
          onConfirm={handleDelete}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default AuthorsPage;
