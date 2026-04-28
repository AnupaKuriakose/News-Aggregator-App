import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ArticleList from "./components/ArticleList";
import SavedSidebar from "./components/SavedSidebar";
import { Article } from "./types/article";
import { fetchNewsByCategory, searchNews } from "./services/api";

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [saved, setSaved] = useState<Article[]>([]);
  const [category, setCategory] = useState("technology");
  const [loading, setLoading] = useState(false);

  // Fetch on load + category change
  useEffect(() => {
    loadCategoryNews();
  }, [category]);

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
      const isAlreadySaved = prev.some((s)=> s.id === article.id);
      if (isAlreadySaved) return prev.filter((s)=> s.id!== article.id);//remove 
      return [...prev, article];//add 
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Header onSearch={handleSearch} savedCount={saved.length} />

      <CategoryTabs category={category} setCategory={setCategory} />

      {loading && <p>Loading...</p>}

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