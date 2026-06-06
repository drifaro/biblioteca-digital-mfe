import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  smallValue?: boolean;
}

export const StatCard = ({
  label,
  value,
  sub,
  smallValue = false,
}: StatCardProps) => (
  <div className={styles.statCard}>
    <p className={styles.statLabel}>{label}</p>
    <p
      className={styles.statValue}
      style={smallValue ? { fontSize: "18px", marginTop: "4px" } : undefined}
    >
      {value}
    </p>
    {sub && <p className={styles.statSub}>{sub}</p>}
  </div>
);

export default StatCard;