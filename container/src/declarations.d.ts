declare module "mfe_books/BooksPage" {
  import type { ComponentType } from "react";
  const BooksPage: ComponentType;
  export default BooksPage;
}

declare module "mfe_authors/AuthorsPage" {
  import type { ComponentType } from "react";
  const AuthorsPage: ComponentType;
  export default AuthorsPage;
}

declare module "mfe_shared/Header" {
  import type { ComponentType } from "react";
  const Header: ComponentType<{
    activeView: "books" | "authors";
    setActiveView: (v: "books" | "authors") => void;
    bookCount: number;
    authorCount: number;
  }>;
  export default Header;
}

declare module "mfe_shared/Footer" {
  import type { ComponentType } from "react";
  const Footer: ComponentType;
  export default Footer;
}
