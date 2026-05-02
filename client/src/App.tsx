import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ArticleList from "./components/ArticleList";
import SavedSidebar from "./components/SavedSidebar";
import { Article } from "./types/article";
import { classifySentiment, fetchNewsByCategory, searchNews } from "./services/api";
import styles from './App.module.css';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [saved, setSaved] = useState<Article[]>([]);
  const [category, setCategory] = useState("technology");
  const [loading, setLoading] = useState(false);

  // Fetch on load + category change
  useEffect(() => {
    loadCategoryNews();
  }, [category]);

  // Effect 2 — NEW, silent sentiment call
useEffect(() => {
  // don't run until articles are loaded
  if (articles.length === 0) return;

  // don't run if sentiment already exists on these articles
  if (articles.every(a => a.sentiment)) return;

  console.log("Fetching sentiment silently...");

  classifySentiment(articles)
    .then((labels) => {
      // patch sentiment onto each article without refetching
      setArticles(prev =>
        prev.map((article, i) => ({
          ...article,
          sentiment: labels[i] as Article["sentiment"]
        }))
      );
    })
    .catch(err => {
      // silent fail — badges just won't show, app still works
      console.error("Sentiment failed:", err);
    });

}, [category]); // runs when article count changes (new category loaded)

  const loadCategoryNews = async () => {
    setLoading(true);
    try {
      const data = await fetchNewsByCategory(category);
      setArticles(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Search
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await searchNews(query);
      setArticles(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Save
  const handleSave = (article: Article) => {
    setSaved((prev) => {
      const isAlreadySaved = prev.some((s) => s.id === article.id);
      if (isAlreadySaved) return prev.filter((s) => s.id !== article.id);//remove 
      return [...prev, article];//add 
    });
  };

  return (
    <div className={styles.app}>
      <Header onSearch={handleSearch} savedCount={saved.length} />
      <CategoryTabs category={category} setCategory={setCategory} />
      <div className={styles.content}>
        <div className={styles.articles}>
          {loading ? <p>Loading...</p> :
            <ArticleList articles={articles} saved={saved} onSave={handleSave} />}
        </div>
        <div className={styles.feed}>
          <SavedSidebar saved={saved} />
        </div>
      </div>
    </div>
  );
}

export default App;