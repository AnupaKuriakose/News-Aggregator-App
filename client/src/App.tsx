import { useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Article } from "./types/article";
import CategoryTabs from "./components/CategoryTabs";
import ArticleList from "./components/ArticleList";
import SavedSidebar from "./components/SavedSidebar";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import { useNewsWithSentiment } from "./hooks/useNewsWithSentiment";
import styles from "./App.module.css";

function App() {
  const [category, setCategory] = useState("technology");
  const [saved, setSaved] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // The hook owns fetching AND sentiment, so no enrichment effect is needed here
  const { byCategory, isLoading } = useNewsWithSentiment([category]);
  const articles = useMemo(
    () => byCategory[category] ?? [],
    [byCategory, category]
  );
  const HEADINGS: Record<string, { title: string; tagline: string }> = {
  technology: { title: "The Tech Brief", tagline: "What's shaping the industry" },
  business: { title: "Money & Markets", tagline: "Business and finance headlines" },
  general: { title: "Today's Headlines", tagline: "The stories people are talking about" },
};

  // Search is derived data, not state
  const displayArticles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [articles, searchTerm]);

  // Toggles: saves if new, removes if already saved
  const handleSave = (article: Article) => {
    setSaved((prev) => {
      const already = prev.some((s) => s.id === article.id);
      return already
        ? prev.filter((s) => s.id !== article.id)
        : [...prev, article];
    });
  };

const trimmed = searchTerm.trim();
const preset = HEADINGS[category] ?? {
  title: "Latest News",
  tagline: "Fresh from the newsroom",
};

const title = trimmed ? `Results for “${trimmed}”` : preset.title;
const tagline = trimmed
  ? `${displayArticles.length} matching ${displayArticles.length === 1 ? "article" : "articles"}`
  : `${articles.length} stories · ${preset.tagline}`;

  return (
    <Layout onSearch={setSearchTerm} savedCount={saved.length}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 className={styles.heading}>{title}</h1>
<p className={styles.tagline}>{tagline}</p>
              <CategoryTabs category={category} setCategory={setCategory} />

              <div className={styles.content}>
                <div className={styles.feed}>
                  <ArticleList
                    articles={displayArticles}
                    saved={saved}
                    onSave={handleSave}
                    loading={isLoading}
                    category={category}
                  />
                </div>
                <div className={styles.rail}>
                  <SavedSidebar saved={saved} onRemove={handleSave} />
                </div>
              </div>
            </>
          }
        />
        <Route
          path="/analytics"
          element={
            <ErrorBoundary>
              <AnalyticsDashboard />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;