import axios from "axios";
import { Article } from "../types/article";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// ── News ─────────────────────────────────────────────────────────────────────

const normalizeArticle = (a: any): Article => ({
  id: a.url,
  title: a.title,
  description: a.description,
  source: a.source?.name,
  image: a.image,
  publishedAt: a.publishedAt,
  url: a.url,
});

export const fetchNewsByCategory = async (category: string): Promise<Article[]> => {
  const res = await axios.get(`${BASE_URL}/api/news?category=${category}`);
  return res.data.articles.map(normalizeArticle);
};

export const searchNews = async (query: string): Promise<Article[]> => {
  if (!query.trim()) return [];
  const res = await axios.get(`${BASE_URL}/api/news/search?q=${encodeURIComponent(query)}`);
  return res.data.articles.map(normalizeArticle);
};



// ── Saved articles ────────────────────────────────────────────────────────────

export const saveArticle = async (article: Article) => {
  await axios.post(`${BASE_URL}/api/saved`, article);
};

export const getSavedArticles = async (): Promise<Article[]> => {
  const res = await axios.get(`${BASE_URL}/api/saved`);
  return res.data;
};

export const deleteArticle = async (title: string) => {
  await axios.delete(`${BASE_URL}/api/saved/${encodeURIComponent(title)}`);
};


// ── Sentiment ─────────────────────────────────────────────────────────────────

export async function classifySentiment(articles: Article[]): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/sentiment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ articles: articles.map(a => ({ url: a.url, title: a.title })) }),
  });
  const data = await res.json();
  return data.data.labels;
}

// ── Summarize ─────────────────────────────────────────────────────────────────

export async function summarizeArticle(article: Article): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: article.title, description: article.description, url: article.url }),
    });
    const data = await res.json();
    return data.data.bullets;
  } catch (error) {
    console.error("Summarize failed:", error);
    return [];
  }
}
