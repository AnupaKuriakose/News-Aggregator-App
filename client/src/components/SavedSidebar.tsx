import { Article } from "../types/article";
import styles from "./SavedSidebar.module.css";

type Props = {
  saved: Article[];
  onRemove?: (a: Article) => void;
};

function SavedSidebar({ saved, onRemove }: Props) {
  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ color: "#378ADD" }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span className={styles.headerTitle}>Reading list</span>
          {saved.length > 0 && (
            <span className={styles.count}>{saved.length}</span>
          )}
        </div>
      </div>

      {/* Empty state */}
      {saved.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔖</div>
          <p className={styles.emptyText}>No saved articles yet</p>
          <p className={styles.emptyHint}>Hit Save on any article to add it here.</p>
        </div>
      )}

      {/* Saved list */}
      {saved.length > 0 && (
        <div className={styles.list}>
          {saved.map((a, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.itemBody}>
                <a href={a.url} target="_blank" rel="noreferrer">
                  <p className={styles.itemTitle}>{a.title}</p>
                </a>
                {a.source && (
                  <span className={styles.itemSource}>{a.source}</span>
                )}
              </div>
              {onRemove && (
                <button
                  className={styles.removeBtn}
                  onClick={() => onRemove(a)}
                  aria-label="Remove from saved"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </aside>
  );
}

export default SavedSidebar;
