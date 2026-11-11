import styles from "./StatCard.module.css";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: "primary" | "secondary" | "success" | "warning" | "danger";
};

const accentClass = {
  primary: styles.accentPrimary,
  secondary: styles.accentSecondary,
  success: styles.accentSuccess,
  warning: styles.accentWarning,
  danger: styles.accentDanger,
};

function StatCard({ title, value, subtitle, accent = "primary" }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.title}>{title}</span>
      <div className={`${styles.value} ${accentClass[accent]}`}>{value}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}

export default StatCard;