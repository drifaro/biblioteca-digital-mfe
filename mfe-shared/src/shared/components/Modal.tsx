import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import { CloseIcon } from "../icons";

interface ModalProps {
  title: string;
  onClose: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export const Modal = ({ title, onClose, footer, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose();
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className={styles.modal} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <button className="btn btn-icon" onClick={onClose} aria-label="Fechar">
          <CloseIcon />
        </button>
      </div>

      <div className={styles.modalBody}>{children}</div>

      <div className={styles.modalFooter}>{footer}</div>
    </dialog>
  );
};

export default Modal;
