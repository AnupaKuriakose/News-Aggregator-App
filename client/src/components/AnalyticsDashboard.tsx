import { useNewsWithSentiment } from "../hooks/useNewsWithSentiment";
import { useSentimentStats } from "../hooks/useSentimentStats";
import { pct } from "../utils/pct";
import StatCard from "../components/StatCard";
import SkeletonCard from "./SkeletonCard";
import SentimentChart from "./SentimentChart";
import CategoryRanking from "./CategoryRanking";
import styles from "./AnalyticsDashboard.module.css";

const CATEGORIES = ["technology", "business", "general"];

function AnalyticsDashboard() {
  const { byCategory, allArticles, isLoading, isClassifying } =
    useNewsWithSentiment(CATEGORIES);
  const stats = useSentimentStats(allArticles);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Sentiment overview</h1>

      <div className={styles.statGrid}>
        {isLoading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : (
          <>
            <StatCard title="Total Articles" value={stats.total} subtitle="across 3 categories" />
            <StatCard title="Positive" value={stats.positive} accent="success"
              subtitle={`${pct(stats.positive, stats.total)}% of total`} />
            <StatCard title="Neutral" value={stats.neutral} accent="secondary"
              subtitle={`${pct(stats.neutral, stats.total)}% of total`} />
            <StatCard title="Negative" value={stats.negative} accent="danger"
              subtitle={`${pct(stats.negative, stats.total)}% of total`} />
          </>
        )}
      </div>

      {isClassifying && (
        <p className={styles.note}>Analysing sentiment… {stats.pending} articles still pending</p>
      )}

      {!isLoading && (
        <div className={styles.panels}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Sentiment by category</h2>
            <SentimentChart byCategory={byCategory} />
          </section>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Most positive categories</h2>
            <CategoryRanking byCategory={byCategory} />
          </section>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;