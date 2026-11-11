import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, SetStateAction, useMemo } from "react";
import { classifySentiment, fetchNewsByCategory, searchNews } from "./services/api";
import { Article } from "./types/article";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ArticleList from "./components/ArticleList";
import SavedSidebar from "./components/SavedSidebar";
import styles from "./App.module.css";
import StatCard from "./components/StatCard";
import { useSentimentStats } from "./hooks/useSentimentStats";
import { Route, Routes } from "react-router-dom";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

function App() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("technology");
  const [saved, setSaved] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["news", category],
    queryFn: () => fetchNewsByCategory(category),
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Silent sentiment enrichment
  useEffect(() => {
    if (articles.length === 0) return;
    if (articles.every(a => a.sentiment)) return; // already cached with sentiment

    console.log("Fetching sentiment for:", category);

    classifySentiment(articles)
      .then((labels) => {
        // If API returns empty, treat them all as null or a default
        const enriched = articles.map((article, i) => ({
          ...article,
          // If labels[i] exists, use it. Otherwise, use null.
          sentiment: labels[i] ? (labels[i] as Article["sentiment"]) : null
        }));

        queryClient.setQueryData(["news", category], enriched);
      })
      .catch(err => console.error("Sentiment failed:", err));

  }, [articles, category, queryClient]);

  useEffect(() => {
    //set up the timer 
    const delayDebounceFn = setTimeout(() => {
      if (!searchTerm.trim()) { setSearchTerm(''); setSearchResults(articles); return; }
      const query = searchTerm.toLowerCase();
      const filteredata = articles.filter((d) => d.title.toLowerCase().includes(query) || d.description.toLowerCase().includes(query));
      setSearchResults(filteredata);
    }, 500);

    //clean up timer
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, articles])

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };


  const handleSave = (article: Article) => {
    setSaved((prev) => {
      const isAlreadySaved = prev.some((s) => s.id === article.id);
      if (isAlreadySaved) return prev.filter((s) => s.id !== article.id);
      return [...prev, article];
    });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSearchResults(null); // clear search when switching category
  };

  // search results take priority over category feed
 const displayArticles = useMemo(() => {
  const q = searchTerm.trim().toLowerCase();
  if (!q) return articles;
  return articles.filter(
    (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
  );
}, [articles, searchTerm]);

  const stats = useSentimentStats(displayArticles);
  const pct = (n: number, total: number) => total > 0 ? (Math.round((n / total)) * 100).toFixed(2) : 0;

  return (
      <div className={styles.app}>
      <Header onSearch={setSearchTerm} savedCount={saved.length} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className={styles.statGrid}>
                <StatCard
                  title="Total Articles"
                  value={stats.total}
                  subtitle={searchTerm.trim() ? "matching search" : `in ${category}`}
                />
                <StatCard title="Positive" value={stats.positive} accent="success"
                  subtitle={`${pct(stats.positive, stats.total)}% of total`} />
                <StatCard title="Neutral" value={stats.neutral} accent="secondary"
                  subtitle={`${pct(stats.neutral, stats.total)}% of total`} />
                <StatCard title="Negative" value={stats.negative} accent="danger"
                  subtitle={`${pct(stats.negative, stats.total)}% of total`} />
              </div>

              <CategoryTabs
                category={category}
                setCategory={(c: string) => setCategory(c)}
              />

              <div className={styles.content}>
                <div className={styles.articles}>
                  <ArticleList
                    articles={displayArticles}
                    saved={saved}
                    onSave={handleSave}
                    loading={isLoading}
                    category={category}
                  />
                </div>
                <div className={styles.feed}>
                  <SavedSidebar saved={saved} />
                </div>
              </div>
            </>
          }
        />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
 
    </div>
  );
}

export default App;