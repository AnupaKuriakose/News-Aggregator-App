import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { classifySentiment, fetchNewsByCategory, searchNews } from "./services/api";
import { Article } from "./types/article";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ArticleList from "./components/ArticleList";
import SavedSidebar from "./components/SavedSidebar";
import styles from "./App.module.css";

function App() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("technology");
  const [saved, setSaved] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);

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
        const enriched = articles.map((article, i) => ({
          ...article,
          sentiment: labels[i] as Article["sentiment"]
        }));
        // store enriched articles back into React Query cache
        queryClient.setQueryData(["news", category], enriched);
      })
      .catch(err => console.error("Sentiment failed:", err));

  }, [articles]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null); // clear search, go back to category feed
      return;
    }
    const data = await searchNews(query);
    setSearchResults(data);
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
  const displayArticles = searchResults ?? articles;

  return (
    <div className={styles.app}>
      <Header onSearch={handleSearch} savedCount={saved.length} />
      <CategoryTabs category={category} setCategory={handleCategoryChange} />
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
    </div>
  );
}

export default App;