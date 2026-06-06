import React from "react";
import styles from "./Header.module.css";
import { BrandIcon, BooksIcon, PersonIcon as AuthorsIcon } from "../icons";

interface HeaderProps {
  activeView: "books" | "authors";
  setActiveView: (view: "books" | "authors") => void;
  bookCount: number;
  authorCount: number;
}

const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  bookCount,
  authorCount,
}) => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerInner}>
        <div className={styles.headerBrand}>
          <BrandIcon />
          <span className={styles.brandName}>Biblioteca Digital</span>
          <span className={styles.brandBadge}>MFE</span>
        </div>

        <nav className={styles.appNav}>
          <button
            className={`${styles.navBtn} ${activeView === "books" ? styles.active : ""}`}
            onClick={() => setActiveView("books")}
          >
            <BooksIcon />
            Livros
            <span className={styles.navCount}>{bookCount}</span>
          </button>

          <button
            className={`${styles.navBtn} ${activeView === "authors" ? styles.active : ""}`}
            onClick={() => setActiveView("authors")}
          >
            <AuthorsIcon />
            Autores
            <span className={styles.navCount}>{authorCount}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
