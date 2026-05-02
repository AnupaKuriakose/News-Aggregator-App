import { useState } from "react";
import { Article } from "../types/article";
import styles from "./ArticleCard.module.css";

type Props = {
  article: Article;
  onSave: (a: Article) => void;
  isSaved: boolean;
};

function ArticleCard({ article, onSave, isSaved }: Props) {
  const [summary, setSummary] = useState<string[] | null>(null);
  const [summarising, setSummarising] = useState(false);
  const [imgError, setImgError] = useState(false);


  const timeAgo = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3_600_000);
    if (h < 1) return "just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  // const handleSummarise = async () => {
  //   if (summary) { setSummary(null); return; }
  //   setSummarising(true);
  //   try {
  //     const res = await fetch("/api/summarize", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ title: article.title, description: article.description }),
  //     });
  //     const data = await res.json();
  //     setSummary(data.data.bullets);
  //   } catch {
  //     setSummary(["Could not generate summary. Please try again."]);
  //   } finally {
  //     setSummarising(false);
  //   }
  // };

  //Sentiment badge class
  const sentimentClass = article.sentiment
    ? styles[article.sentiment as "positive" | "neutral" | "negative"]
    : null;

  return (
    <article className={styles.card}>
      {/* Thumbnail */}
      {article.image && !imgError ? (
        <img
          className={styles.img}
          src={article.image}
          alt=""
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.imgPlaceholder}>📰</div>
      )}

      <div className={styles.body}>
        {/* Meta */}
        <div className={styles.meta}>
          <span className={styles.source}>{article.source}</span>
          {article.publishedAt && (
            <>
              <span className={styles.dot}>·</span>
              <span>{timeAgo(article.publishedAt)}</span>
            </>
          )}
          {article.sentiment && sentimentClass && (
            <span className={`${styles.sentimentBadge} ${sentimentClass}`}>
              {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <a href={article.url} target="_blank" rel="noreferrer">
          <h2 className={styles.title}>{article.title}</h2>
        </a>

        {/* Description */}
        <p className={styles.desc}>{article.description}</p>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button
            className={isSaved ? styles.btnSaved : styles.btnSave}
            onClick={() => onSave(article)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {isSaved ? "Saved" : "Save"}
          </button>

          <button
            className={styles.btnSummarise}
            disabled={summarising}
          >
            <span className={styles.aiChip}>AI</span>
            {summarising ? "Summarising…" : summary ? "Hide" : "Summarise"}
          </button>
        </div>

        {/* Summary panel */}
        {summary && (
          <div className={styles.summary}>
            {summary.map((bullet, i) => (
              <p key={i} className={styles.summaryBullet}>• {bullet}</p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default ArticleCard;
