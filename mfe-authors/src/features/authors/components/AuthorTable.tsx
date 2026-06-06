import type { Author, Book } from "../../../types";
import styles from "./AuthorTable.module.css";
import AuthorAvatar from "mfe_shared/AuthorAvatar";
import EmptyState from "mfe_shared/EmptyState";
import EditIcon from "mfe_shared/EditIcon";
import TrashIcon from "mfe_shared/TrashIcon";

interface AuthorTableProps {
  authors: Author[];
  books: Book[];
  hasFilters: boolean;
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
}

export const AuthorTable = ({
  authors,
  books,
  hasFilters,
  onEdit,
  onDelete,
}: AuthorTableProps) => {
  const bookCountFor = (authorId: number) =>
    books.filter((b) => b.authorId === authorId).length;

  return (
    <div className={styles.tableCard}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Autor</th>
            <th>Nacionalidade</th>
            <th>Ano Nasc.</th>
            <th>Livros no Acervo</th>
            <th style={{ textAlign: "right" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {authors.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <EmptyState
                  icon="person"
                  message={
                    hasFilters
                      ? "Nenhum autor encontrado para os filtros aplicados."
                      : "Nenhum autor cadastrado."
                  }
                />
              </td>
            </tr>
          ) : (
            authors.map((author) => {
              const count = bookCountFor(author.id);
              return (
                <tr key={author.id}>
                  <td>
                    <div className={styles.authorCell}>
                      <AuthorAvatar name={author.name} image={author.image} />
                      <strong style={{ fontFamily: "var(--font-sans)" }}>
                        {author.name}
                      </strong>
                    </div>
                  </td>
                  <td>
                    {author.nationality ? (
                      <span className={`badge ${styles.badgeNat}`}>
                        {author.nationality}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    {author.birthYear ?? <span className="text-muted">—</span>}
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 500,
                        color:
                          count > 0
                            ? "var(--color-primary)"
                            : "var(--color-text-3)",
                      }}
                    >
                      {count} {count === 1 ? "livro" : "livros"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.tdActions}>
                      <button
                        className="btn btn-icon btn-sm"
                        onClick={() => onEdit(author)}
                        title="Editar"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(author)}
                        title="Remover"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
