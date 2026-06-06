import { useState } from "react";
import type { Book } from "../../../types";
import Modal from "mfe_shared/Modal";
import styles from "./BookDeleteModal.module.css";

interface BookDeleteModalProps {
  book: Book;
  authorName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const BookDeleteModal = ({
  book,
  authorName,
  onConfirm,
  onClose,
}: BookDeleteModalProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  const footer = (
    <>
      <button
        className="btn btn-secondary"
        onClick={onClose}
        disabled={deleting}
      >
        Cancelar
      </button>
      <button
        className="btn btn-primary"
        style={{
          background: "var(--color-danger-light)",
          borderColor: "var(--color-danger-light)",
        }}
        onClick={handleConfirm}
        disabled={deleting}
      >
        {deleting ? "Removendo…" : "Remover"}
      </button>
    </>
  );

  return (
    <Modal title="Remover Livro" onClose={onClose} footer={footer}>
      <p className={styles.confirmText}>
        Tem certeza que deseja remover{" "}
        <span className={styles.confirmName}>"{book.title}"</span> de{" "}
        {authorName}?
      </p>
      <p className={styles.confirmWarning}>
        ⚠ Esta ação não pode ser desfeita.
      </p>
    </Modal>
  );
};
