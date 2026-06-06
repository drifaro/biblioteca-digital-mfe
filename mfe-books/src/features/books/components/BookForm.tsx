import type { Author, BookFormState, BookFormErrors } from "../../../types";
import { GENRES } from "../../../types";
import styles from "./BookForm.module.css";

interface BookFormProps {
  form: BookFormState;
  setForm: React.Dispatch<React.SetStateAction<BookFormState>>;
  authors: Author[];
  errors: BookFormErrors;
}

export const BookForm = ({ form, setForm, authors, errors }: BookFormProps) => (
  <div>
    <div className={styles.formGroup}>
      <label htmlFor="book-title" className={styles.formLabel}>
        Título <span>*</span>
      </label>
      <input
        id="book-title"
        className={`${styles.formInput} ${errors.title ? styles.error : ""}`}
        placeholder="Ex: Dom Casmurro"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />
      {errors.title && <p className={styles.formError}>{errors.title}</p>}
    </div>

    <div className={styles.formGroup}>
      <label htmlFor="book-author" className={styles.formLabel}>
        Autor <span>*</span>
      </label>
      <select
        id="book-author"
        className={`${styles.formSelect} ${errors.authorId ? styles.error : ""}`}
        value={form.authorId}
        onChange={(e) => setForm((f) => ({ ...f, authorId: e.target.value }))}
      >
        <option value="">Selecione um autor</option>
        {authors.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      {errors.authorId && <p className={styles.formError}>{errors.authorId}</p>}
    </div>

    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label htmlFor="book-year" className={styles.formLabel}>Ano de Publicação</label>
        <input
          id="book-year"
          className={styles.formInput}
          placeholder="Ex: 1899"
          type="number"
          min={1000}
          max={new Date().getFullYear()}
          value={form.year}
          onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="book-genre" className={styles.formLabel}>Gênero</label>
        <select
          id="book-genre"
          className={styles.formSelect}
          value={form.genre}
          onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
        >
          <option value="">Selecione</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
    </div>

    <div className={styles.formGroup}>
      <label htmlFor="book-isbn" className={styles.formLabel}>ISBN</label>
      <input
        id="book-isbn"
        className={styles.formInput}
        placeholder="Ex: 978-85-359-0277-5"
        value={form.isbn}
        onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))}
      />
    </div>
  </div>
);
