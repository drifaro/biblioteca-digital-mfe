import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.appFooter}>
      <span>Biblioteca Digital Simplificada — Arquitetura MFE</span>
      <span>TCC • React + Vite + TypeScript + MSW • {new Date().getFullYear()}</span>
      <span>
        Desenvolvido por{" "}
        <a
          href="https://github.com/drifaro"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          Drislaine Faro
        </a>
      </span>
    </footer>
  );
};

export default Footer;
