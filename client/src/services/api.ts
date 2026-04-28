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
    source: a.source?.name
  }));
};

export const searchNews = async (query: string): Promise<Article[]> => {
  const res = await axios.get(
    `https://gnews.io/api/v4/search?q=${query}&token=${API_KEY}&lang=en`
  );

  return res.data.articles.map((a: any) => ({
    title: a.title,
    description: a.description,
    source: a.source?.name
  }));
};