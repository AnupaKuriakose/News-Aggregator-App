import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ArticleList from "./components/ArticleList";
import SavedSidebar from "./components/SavedSidebar";
import { Article } from "./types/article";
import styles from './App.module.css';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [saved, setSaved] = useState<Article[]>([]);
  const [category, setCategory] = useState("technology");

  useEffect(() => {
    // TEMP dummy data
    setArticles([
      { title: "Tech News 1", description: "Desc 1" },
      { title: "Tech News 2", description: "Desc 2" }
    ]);
  }, [category]);

  const handleSave = (article: Article) => {
    setSaved((prev) => [...prev, article]);
  };

  const handleSearch = (query: string) => {
    console.log("search:", query);
  };

  return (
    <div className={styles.App}>
      <Header onSearch={handleSearch} savedCount={saved.length} />

      <CategoryTabs category={category} setCategory={setCategory} />

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 3 }}>
          <ArticleList articles={articles} saved={saved} onSave={handleSave} />
        </div>

        <div style={{ flex: 1 }}>
          <SavedSidebar saved={saved} />
        </div>
      </div>
    </div>
  );
}

export default App;