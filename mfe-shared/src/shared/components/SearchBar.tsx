import styles from "./SearchBar.module.css";
import { SearchIcon } from "../icons";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  value: string;
  placeholder: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters?: FilterConfig[];
}

export const SearchBar = ({
  search,
  onSearchChange,
  placeholder = "Buscar…",
  filters = [],
}: SearchBarProps) => (
  <div className={styles.searchBar}>
    <div className={styles.searchInputWrap}>
      <SearchIcon />
      <input
        className={styles.searchInput}
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    {filters.map((filter) => (
      <select
        key={filter.placeholder}
        className={styles.filterSelect}
        value={filter.value}
        onChange={(e) => filter.onChange(e.target.value)}
      >
        <option value="">{filter.placeholder}</option>
        {filter.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ))}
  </div>
);

export default SearchBar;