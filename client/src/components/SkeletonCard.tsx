import styles from "./SkeletonCard.module.css";

function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.title} />
      <div className={styles.value} />
      <div className={styles.subtitle} />
    </div>
  );
}

export default SkeletonCard;