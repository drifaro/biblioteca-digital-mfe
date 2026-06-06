import { useState } from "react";
import type { Author, BookFormState, BookFormErrors } from "../../../types";
import Modal from "mfe_shared/Modal";
import { BookForm } from "./BookForm";

interface BookModalProps {
  mode: "add" | "edit";
  form: BookFormState;
  setForm: React.Dispatch<React.SetStateAction<BookFormState>>;
  authors: Author[];
  onSave: () => Promise<void>;
  onClose: () => void;
}

export const BookModal = ({
  mode,
  form,
  setForm,
  authors,
  onSave,
  onClose,
}: BookModalProps) => {
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [saving, setSaving] = useState(false);

  const validate = (): BookFormErrors => {
    const e: BookFormErrors = {};
    if (!form.title.trim()) e.title = "Título é obrigatório";
    if (!form.authorId) e.authorId = "Selecione um autor";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  const footer = (
    <>
      <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
        Cancelar
      </button>
      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving
          ? "Salvando…"
          : mode === "add"
            ? "Cadastrar"
            : "Salvar Alterações"}
      </button>
    </>
  );

  return (
    <Modal
      title={mode === "add" ? "Cadastrar Livro" : "Editar Livro"}
      onClose={onClose}
      footer={footer}
    >
      <BookForm
        form={form}
        setForm={setForm}
        authors={authors}
        errors={errors}
      />
    </Modal>
  );
};
