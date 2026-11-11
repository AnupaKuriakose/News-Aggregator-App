import { useMemo } from "react";
import { Article } from "../types/article";

export type SentimentStats = {
    total: number;
    positive: number;
    neutral: number;
    negative: number;
    pending: number;
};

export function useSentimentStats(articles: Article[]): SentimentStats {
    return useMemo(() => {
        const stats: SentimentStats = {
            total: articles.length,
            positive: 0,
            neutral: 0,
            negative: 0,
            pending: 0
        }

        for (const a of articles) {
            if (a.sentiment === "positive") stats.positive++;
            else if (a.sentiment === "neutral") stats.neutral++;
            else if (a.sentiment === "negative") stats.negative++;
            else stats.pending++;
        }
        return stats;
    }, [articles])

}