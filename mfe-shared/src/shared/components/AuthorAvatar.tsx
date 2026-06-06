import styles from "./AuthorAvatar.module.css";

type AuthorAvatarProps = {
  name: string;
  image?: string | null;
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export const AuthorAvatar = ({ name, image }: AuthorAvatarProps) => (
  <span className={styles.authorAvatar} aria-label={name} title={name}>
    {image ? (
      <img className={styles.authorAvatarImage} src={image} alt={name} />
    ) : (
      getInitials(name)
    )}
  </span>
);

export default AuthorAvatar;