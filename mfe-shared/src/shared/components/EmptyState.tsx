import { BooksIcon, PersonIcon } from "../icons";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  message: string;
  icon?: "book" | "person";
}

export const EmptyState = ({ message, icon = "book" }: EmptyStateProps) => (
  <div className={styles.emptyState}>
    {icon === "book" ? <BooksIcon /> : <PersonIcon />}
    <p>{message}</p>
  </div>
);

export default EmptyState;