import type { AuthorFormState, AuthorFormErrors } from "../../../types";
import { NATIONALITIES } from "../../../types";
import styles from "./AuthorForm.module.css";

interface AuthorFormProps {
  form: AuthorFormState;
  setForm: React.Dispatch<React.SetStateAction<AuthorFormState>>;
  errors: AuthorFormErrors;
}

export const AuthorForm = ({ form, setForm, errors }: AuthorFormProps) => (
  <div>
    <div className={styles.formGroup}>
      <label htmlFor="author-name" className={styles.formLabel}>
        Nome Completo <span>*</span>
      </label>
      <input
        id="author-name"
        className={`${styles.formInput} ${errors.name ? styles.error : ""}`}
        placeholder="Ex: Machado de Assis"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      {errors.name && <p className={styles.formError}>{errors.name}</p>}
    </div>

    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label htmlFor="author-nationality" className={styles.formLabel}>Nacionalidade</label>
        <select
          id="author-nationality"
          className={styles.formSelect}
          value={form.nationality}
          onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
        >
          <option value="">Selecione</option>
          {NATIONALITIES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="author-birth-year" className={styles.formLabel}>Ano de Nascimento</label>
        <input
          id="author-birth-year"
          className={styles.formInput}
          placeholder="Ex: 1839"
          type="number"
          min={1000}
          max={new Date().getFullYear()}
          value={form.birthYear}
          onChange={(e) => setForm((f) => ({ ...f, birthYear: e.target.value }))}
        />
      </div>
    </div>
  </div>
);
