import { useState } from "react";
import { Article } from "../types/article";
import { summarizeArticle } from "../services/api";
import styles from "./ArticleCard.module.css";

type Variant = "lead" | "compact" | "row";

type Props = {
  article: Article;
  onSave: (a: Article) => void;
  isSaved: boolean;
  variant?: Variant;
};

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return "";
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

function ArticleCard({ article, onSave, isSaved, variant = "row" }: Props) {
  const [summary, setSummary] = useState<string[] | null>(null);
  const [summarising, setSummarising] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSummarise = async () => {
    if (summary) {
      setSummary(null);
      return;
    }
    setSummarising(true);
    try {
      const data = await summarizeArticle(article);
      setSummary(
        data && data.length > 0
          ? data
          : ["Could not generate summary. Please try again."]
      );
    } catch {
      setSummary(["Could not generate summary. Please try again."]);
    } finally {
      setSummarising(false);
    }
  };

  const sentiment = article.sentiment;
  const time = article.publishedAt ? timeAgo(article.publishedAt) : "";

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      {/* Image: lead and row only */}
      {variant !== "compact" &&
        (article.image && !imgError ? (
          <img
            className={styles.img}
            src={article.image}
            alt=""
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden="true">
            📰
          </div>
        ))}

      <div className={styles.body}>
        <div className={styles.kicker}>
          <span>{article.source}</span>
          {time && (
            <>
              <span className={styles.dot}>·</span>
              <span>{time}</span>
            </>
          )}
        </div>

        <a
          className={styles.link}
          href={article.url}
          target="_blank"
          rel="noreferrer"
        >
          <h2 className={styles.title}>{article.title}</h2>
        </a>

        {variant !== "compact" && (
          <p className={styles.desc}>{article.description}</p>
        )}

        <div className={styles.footer}>
          {sentiment ? (
            <span className={`${styles.badge} ${styles[sentiment]}`}>
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </span>
          ) : (
            <span className={styles.pending}>Analysing tone…</span>
          )}

          <button
            type="button"
            className={`${styles.btn} ${isSaved ? styles.btnActive : ""}`}
            onClick={() => onSave(article)}
            aria-pressed={isSaved}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {isSaved ? "Saved" : "Save"}
          </button>

          <button
            type="button"
            className={styles.btn}
            disabled={summarising}
            onClick={handleSummarise}
          >
            <span className={styles.aiChip}>AI</span>
            {summarising ? "Summarising…" : summary ? "Hide" : "Summarise"}
          </button>
        </div>

        {summary && (
          <div className={styles.summary}>
            {summary.map((bullet, i) => (
              <p key={i} className={styles.summaryBullet}>
                • {bullet}
              </p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default ArticleCard;