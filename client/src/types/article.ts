export interface Article {
  id: string;
  title: string;
  description: string;
  source?: string;
  image?: string;
  publishedAt?: string;
  url?: string;
  sentiment?: "positive" | "neutral" | "negative"; 
}