import type { Book, Author } from "../../../types";
import styles from "./BookTable.module.css";
import AuthorAvatar from "mfe_shared/AuthorAvatar";
import EmptyState from "mfe_shared/EmptyState";
import EditIcon from "mfe_shared/EditIcon";
import TrashIcon from "mfe_shared/TrashIcon";

interface BookTableProps {
  books: Book[];
  authors: Author[];
  hasFilters: boolean;
  authorName: (id: number) => string;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export const BookTable = ({
  books,
  authors,
  hasFilters,
  authorName,
  onEdit,
  onDelete,
}: BookTableProps) => (
  <div className={styles.tableCard}>
    <table className={styles.dataTable}>
      <thead>
        <tr>
          <th>Título</th>
          <th>Autor</th>
          <th>Gênero</th>
          <th>Ano</th>
          <th>ISBN</th>
          <th style={{ textAlign: "right" }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {books.length === 0 ? (
          <tr>
            <td colSpan={6}>
              <EmptyState
                icon="book"
                message={
                  hasFilters
                    ? "Nenhum livro encontrado para os filtros aplicados."
                    : "Nenhum livro cadastrado."
                }
              />
            </td>
          </tr>
        ) : (
          books.map((book) => (
            <tr key={book.id}>
              <td>
                <strong
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: "var(--color-primary)",
                  }}
                >
                  {book.title}
                </strong>
              </td>
              <td>
                <div className={styles.authorCell}>
                  <AuthorAvatar
                    name={authorName(book.authorId)}
                    image={authors.find((a) => a.id === book.authorId)?.image}
                  />
                  <span>{authorName(book.authorId)}</span>
                </div>
              </td>
              <td>
                {book.genre ? (
                  <span className={`badge ${styles.badgeGenre}`}>
                    {book.genre}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td>{book.year ?? <span className="text-muted">—</span>}</td>
              <td>
                <span className="text-muted">{book.isbn ?? "—"}</span>
              </td>
              <td>
                <div className={styles.tdActions}>
                  <button
                    className="btn btn-icon btn-sm"
                    onClick={() => onEdit(book)}
                    title="Editar"
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(book)}
                    title="Remover"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
