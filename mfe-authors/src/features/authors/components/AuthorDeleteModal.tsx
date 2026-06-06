import { useState } from "react";
import type { Author } from "../../../types";
import Modal from "mfe_shared/Modal";
import styles from "./AuthorDeleteModal.module.css";

interface AuthorDeleteModalProps {
  author: Author;
  bookCount: number;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const AuthorDeleteModal = ({ author, bookCount, onConfirm, onClose }: AuthorDeleteModalProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); } finally { setDeleting(false); }
  };

  const footer = (
    <>
      <button className="btn btn-secondary" onClick={onClose} disabled={deleting}>
        Cancelar
      </button>
      <button
        className="btn btn-primary"
        style={{ background: "var(--color-danger-light)", borderColor: "var(--color-danger-light)" }}
        onClick={handleConfirm}
        disabled={deleting}
      >
        {deleting ? "Removendo…" : "Remover"}
      </button>
    </>
  );

  return (
    <Modal title="Remover Autor" onClose={onClose} footer={footer}>
      <p className={styles.confirmText}>
        Tem certeza que deseja remover o autor{" "}
        <span className={styles.confirmName}>{author.name}</span>?
      </p>
      {bookCount > 0 && (
        <p className={styles.confirmWarning}>
          ⚠ Este autor possui {bookCount} livro{bookCount === 1 ? "" : "s"}{" "}
          cadastrado{bookCount === 1 ? "" : "s"}. Os livros associados permanecerão no sistema.
        </p>
      )}
    </Modal>
  );
};
