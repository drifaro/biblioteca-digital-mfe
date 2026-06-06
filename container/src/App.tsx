import React, { Suspense, useEffect, useState } from "react";
import styles from "./App.module.css";

const Header = React.lazy(() =>
  import("mfe_shared/Header").then((m) => ({ default: m.default ?? m })),
);
const Footer = React.lazy(() =>
  import("mfe_shared/Footer").then((m) => ({ default: m.default ?? m })),
);
const BooksPage = React.lazy(() =>
  import("mfe_books/BooksPage").then((m) => ({ default: m.default ?? m })),
);
const AuthorsPage = React.lazy(() =>
  import("mfe_authors/AuthorsPage").then((m) => ({ default: m.default ?? m })),
);

type View = "books" | "authors";

export const App = () => {
  const [activeView, setActiveView] = useState<View>("books");
  const [bookCount, setBookCount] = useState(0);
  const [authorCount, setAuthorCount] = useState(0);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => setBookCount(data.length))
      .catch(() => {});

    fetch("/api/authors")
      .then((r) => r.json())
      .then((data) => setAuthorCount(data.length))
      .catch(() => {});

    const onBooks = (e: Event) => {
      setBookCount((e as CustomEvent<{ count: number }>).detail.count);
    };
    const onAuthors = (e: Event) => {
      setAuthorCount((e as CustomEvent<{ count: number }>).detail.count);
    };

    globalThis.addEventListener("mfe:books:loaded", onBooks);
    globalThis.addEventListener("mfe:authors:loaded", onAuthors);

    return () => {
      globalThis.removeEventListener("mfe:books:loaded", onBooks);
      globalThis.removeEventListener("mfe:authors:loaded", onAuthors);
    };
  }, []);

  const fallback = (
    <div style={{ padding: "3rem", textAlign: "center" }}>Carregando…</div>
  );

  return (
    <div className={styles.appShell}>
      <Suspense fallback={null}>
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          bookCount={bookCount}
          authorCount={authorCount}
        />
      </Suspense>
      <main className={styles.appMain}>
        <Suspense fallback={fallback}>
          {activeView === "books" ? <BooksPage /> : <AuthorsPage />}
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};
