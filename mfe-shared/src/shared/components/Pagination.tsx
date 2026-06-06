import styles from "./Pagination.module.css";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  label?: string;
};

type PageItem = number | "ellipsis-before" | "ellipsis-after";

const buildPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: PageItem[] = [1];

  if (currentPage > 4) pages.push("ellipsis-before");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let p = start; p <= end; p++) pages.push(p);

  if (currentPage < totalPages - 3) pages.push("ellipsis-after");

  pages.push(totalPages);
  return pages;
};

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage = 6,
  onPageChange,
  label = "itens",
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pages = buildPageItems(currentPage, totalPages);

  if (totalItems <= itemsPerPage) return null;

  return (
    <nav className={styles.pagination} aria-label="Paginação">
      <p className={styles.paginationSummary}>
        Página {currentPage} de {totalPages} • {totalItems} {label}
      </p>
      <div className={styles.paginationControls}>
        <button
          className={styles.paginationBtn}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        {pages.map((page) =>
          typeof page === "string" ? (
            <span key={page} className={styles.paginationEllipsis}>
              …
            </span>
          ) : (
            <button
              key={page}
              className={`${styles.paginationBtn} ${page === currentPage ? styles.active : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          className={styles.paginationBtn}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </nav>
  );
};

export default Pagination;