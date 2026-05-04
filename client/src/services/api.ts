import axios from "axios";
import { Article } from "../types/article";

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

export const fetchNewsByCategory = async (category: string): Promise<Article[]> => {
  const res = await axios.get(
    `https://gnews.io/api/v4/top-headlines?category=${category}&token=${API_KEY}&lang=en`
  );

  return res.data.articles.map((a: any) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    source: a.source?.name,
    image: a.image,
    publishedAt: a.publishedAt,
    url: a.url
  }));
};

export const searchNews = async (query: string): Promise<Article[]> => {
  const res = await axios.get(
    `https://gnews.io/api/v4/search?q=${query}&token=${API_KEY}&lang=en`
  );

  return res.data.articles.map((a: any) => ({
    title: a.title,
    description: a.description,
    source: a.source?.name,
    image: a.image,
    publishedAt: a.publishedAt,
    url: a.url
  }));
};

export const saveArticle = async (article: Article) => {
  await axios.post("http://localhost:5000/api/saved", article);
};


export const getSavedArticles = async (): Promise<Article[]> => {
  const res = await axios.get("http://localhost:5000/api/saved");
  return res.data;
};

export const deleteArticle = async (title: string) => {
  await axios.delete(`http://localhost:5000/api/saved/${title}`);
};


export async function classifySentiment(articles: Article[]): Promise<string[]> {
  const res = await fetch("http://localhost:5000/api/sentiment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      articles: articles.map(a => ({ url: a.url, title: a.title }))
    }),
  });
  const data = await res.json();
  return data.data.labels; // ["positive", "neutral", "negative", ...]
}

export async function summarizeArticle(article: Article)
{

  try {
      const res = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: article.title, description: article.description }),
      });
      const data = await res.json();
       return data.data.bullets;
    }
    catch(error)
    {

    }
}