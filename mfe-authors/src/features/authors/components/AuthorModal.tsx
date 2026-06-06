import { useState } from "react";
import type { AuthorFormState, AuthorFormErrors } from "../../../types";
import Modal from "mfe_shared/Modal";
import { AuthorForm } from "./AuthorForm";

interface AuthorModalProps {
  mode: "add" | "edit";
  form: AuthorFormState;
  setForm: React.Dispatch<React.SetStateAction<AuthorFormState>>;
  onSave: () => Promise<void>;
  onClose: () => void;
}

export const AuthorModal = ({ mode, form, setForm, onSave, onClose }: AuthorModalProps) => {
  const [errors, setErrors] = useState<AuthorFormErrors>({});
  const [saving, setSaving] = useState(false);

  const validate = (): AuthorFormErrors => {
    const e: AuthorFormErrors = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try { await onSave(); } finally { setSaving(false); }
  };

  const footer = (
    <>
      <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
        Cancelar
      </button>
      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Salvando…" : mode === "add" ? "Cadastrar" : "Salvar Alterações"}
      </button>
    </>
  );

  return (
    <Modal
      title={mode === "add" ? "Cadastrar Autor" : "Editar Autor"}
      onClose={onClose}
      footer={footer}
    >
      <AuthorForm form={form} setForm={setForm} errors={errors} />
    </Modal>
  );
};
