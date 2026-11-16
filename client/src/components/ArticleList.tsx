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
  /** Load more only renders when hasMore is true and onLoadMore is provided (NEWSLY-113) */
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
};

function LoadingSkeleton() {
  return (
    <div className={styles.lead} aria-hidden="true">
      <div>
        <div className={`${styles.sk} ${styles.skImage}`} />
        <div className={`${styles.sk} ${styles.skKicker}`} />
        <div className={`${styles.sk} ${styles.skTitle}`} />
        <div className={`${styles.sk} ${styles.skText}`} />
      </div>
      <div>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${styles.sk} ${styles.skSide}`} />
        ))}
      </div>
    </div>
  );
}

const FILTERS: { label: string; value: SentimentFilter; cls: string }[] = [
  { label: "All", value: "all", cls: styles.pillAll },
  { label: "Positive", value: "positive", cls: styles.pillPositive },
  { label: "Neutral", value: "neutral", cls: styles.pillNeutral },
  { label: "Negative", value: "negative", cls: styles.pillNegative },
];

function ArticleList({
  articles,
  saved,
  onSave,
  loading = false,
  category = "technology",
  hasMore = false,
  onLoadMore,
  loadingMore = false,
}: Props) {
  const [sentimentFilter, setSentimentFilter] =
    useState<SentimentFilter>("all");

  const hasSentiment = articles.some((a) => a.sentiment);

  const filtered =
    sentimentFilter === "all"
      ? articles
      : articles.filter((a) => a.sentiment === sentimentFilter);

  const [lead, ...others] = filtered;
  const sideStories = others.slice(0, 3);
  const rest = others.slice(3);

  const categoryLabel =
    category === "business"
      ? "Finance"
      : category.charAt(0).toUpperCase() + category.slice(1);

  const isSaved = (a: Article) => saved.some((s) => s.id === a.id);

  return (
    <div className={styles.wrap}>
      {/* Toolbar: category and count on the left, sentiment filter on the right */}
      <div className={styles.toolbar}>
        <span className={styles.count}>
          {categoryLabel}
          {!loading && articles.length > 0 && ` · ${articles.length} articles`}
        </span>

        {hasSentiment && (
          <div className={styles.pills} role="group" aria-label="Filter by sentiment">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={sentimentFilter === f.value}
                className={`${styles.pill} ${f.cls} ${
                  sentimentFilter === f.value ? styles.pillActive : ""
                }`}
                onClick={() => setSentimentFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <LoadingSkeleton />}

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

      {/* Lead story + side column */}
      {!loading && lead && (
        <div className={styles.lead}>
          <ArticleCard
            variant="lead"
            article={lead}
            onSave={onSave}
            isSaved={isSaved(lead)}
          />
          {sideStories.length > 0 && (
            <div className={styles.side}>
              {sideStories.map((a) => (
                <ArticleCard
                  key={a.url}
                  variant="compact"
                  article={a}
                  onSave={onSave}
                  isSaved={isSaved(a)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Remaining stories */}
      {!loading && rest.length > 0 && (
        <div className={styles.rest}>
          {rest.map((a) => (
            <ArticleCard
              key={a.url}
              variant="row"
              article={a}
              onSave={onSave}
              isSaved={isSaved(a)}
            />
          ))}
        </div>
      )}

      {!loading && hasMore && onLoadMore && (
        <button
          type="button"
          className={styles.more}
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}

export default ArticleList;