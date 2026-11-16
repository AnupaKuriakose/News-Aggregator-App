import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { classifySentiment, fetchNewsByCategory } from "../services/api";
import { Article } from "../types/article";

const ONE_DAY = 24 * 60 * 60 * 1000;

export function useNewsWithSentiment(categories: string[]) {
  const articleQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: ["news", category],
      queryFn: () => fetchNewsByCategory(category),
      staleTime: ONE_DAY,
    })),
  });

  const sentimentQueries = useQueries({
    queries: categories.map((category, i) => {
      const articles = articleQueries[i]?.data ?? [];
      return {
        queryKey: ["sentiment", category, articles.map((a) => a.url)],
        queryFn: () => classifySentiment(articles),
        enabled: articles.length > 0,
        staleTime: ONE_DAY,
        retry: 1,
      };
    }),
  });

  // useQueries returns a new array every render, so memoise on stable signals
  const articleSig = articleQueries.map((q) => q.dataUpdatedAt).join("|");
  const sentimentSig = sentimentQueries.map((q) => q.dataUpdatedAt).join("|");

  const byCategory = useMemo(() => {
    const result: Record<string, Article[]> = {};
    categories.forEach((category, i) => {
      const articles = articleQueries[i]?.data ?? [];
      const labels = sentimentQueries[i]?.data;
      result[category] = articles.map((a, idx) => ({
        ...a,
        sentiment: (labels?.[idx] ?? null) as Article["sentiment"],
      }));
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.join("|"), articleSig, sentimentSig]);

  const allArticles = useMemo(() => Object.values(byCategory).flat(), [byCategory]);

  return {
    byCategory,
    allArticles,
    isLoading: articleQueries.some((q) => q.isLoading),
    isClassifying: sentimentQueries.some((q) => q.isFetching),
  };
}