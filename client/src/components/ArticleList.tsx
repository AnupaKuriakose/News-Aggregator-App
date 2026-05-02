import { useState } from "react";
import { Article } from "../types/article";
import ArticleCard from "./ArticleCard";
import styles from "./ArticleList.module.css";

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

type Props = {
  articles: Article[];
  saved: Article[];
  onSave: (a: Article) => void;
  loading?: boolean;
  category?: string;
};

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonBlock} style={{ width: 82, height: 72, borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className={styles.skeletonBlock} style={{ width: "40%", height: 11 }} />
        <div className={styles.skeletonBlock} style={{ width: "90%", height: 14 }} />
        <div className={styles.skeletonBlock} style={{ width: "75%", height: 14 }} />
        <div className={styles.skeletonBlock} style={{ width: "85%", height: 11 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <div className={styles.skeletonBlock} style={{ width: 60, height: 28, borderRadius: 12 }} />
          <div className={styles.skeletonBlock} style={{ width: 90, height: 28, borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );
}

const FILTERS: { label: string; value: SentimentFilter; cls: string }[] = [
  { label: "All",      value: "all",      cls: styles.pillAll      },
  { label: "Positive", value: "positive", cls: styles.pillPositive },
  { label: "Neutral",  value: "neutral",  cls: styles.pillNeutral  },
  { label: "Negative", value: "negative", cls: styles.pillNegative },
];

function ArticleList({ articles, saved, onSave, loading = false, category = "technology" }: Props) {
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");

  const hasSentiment = articles.some((a) => a.sentiment);

  const filtered = sentimentFilter === "all"
    ? articles
    : articles.filter((a) => a.sentiment === sentimentFilter);
// const hasSentiment = true;
// const filtered = articles;
  const categoryLabel =
    category === "business" ? "Finance" :
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className={styles.wrap}>
      {/* Feed header */}
      <div className={styles.feedHeader}>
        <div>
          <span className={styles.feedTitle}>{categoryLabel}</span>
          {!loading && articles.length > 0 && (
            <span className={styles.feedCount}>{articles.length} articles</span>
          )}
        </div>

        {/* Sentiment filter pills — only shown once AI data arrives */}
        {hasSentiment && (
          <div className={styles.pills}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`${styles.pill} ${f.cls} ${sentimentFilter === f.value ? styles.active : ""}`}
                onClick={() => setSentimentFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className={styles.list}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔍</span>
          <p className={styles.emptyTitle}>No articles found</p>
          <p className={styles.emptyDesc}>
            {sentimentFilter !== "all"
              ? `No ${sentimentFilter} articles here. Try a different filter.`
              : "Try a different search term or category."}
          </p>
        </div>
      )}

      {/* Article cards */}
      {!loading && filtered.length > 0 && (
        <div className={styles.list}>
          {filtered.map((a, i) => (
            <ArticleCard
              key={i}
              article={a}
              onSave={onSave}
              isSaved={saved.some((s) => s.title === a.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticleList;
