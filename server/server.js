import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sentimentCache, sentimentKey, summaryCache } from "./cache.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GNEWS_BASE = "https://gnews.io/api/v4";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";


// ── News ─────────────────────────────────────────────────────────────────────
app.get("/api/news", async (req, res) => {
  const category = req.query.category || "technology";
  try {
    const url = `${GNEWS_BASE}/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=${process.env.GNEWS_API_KEY}`;
    const data = await fetch(url).then(r => r.json());
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: "GNews request failed" });
  }
});

app.get("/api/news/search", async (req, res) => {
  const q = req.query.q || "";
  if (!q.trim()) return res.status(400).json({ error: "Missing query param: q" });
  try {
    const url = `${GNEWS_BASE}/search?q=${encodeURIComponent(q)}&lang=en&max=10&apikey=${process.env.GNEWS_API_KEY}`;
    const data = await fetch(url).then(r => r.json());
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: "GNews search failed" });
  }
});

// ── Saved articles (in-memory) ────────────────────────────────────────────────
let savedArticles = [];

app.get("/api/saved", (_req, res) => {
  res.json(savedArticles);
});

app.post("/api/saved", (req, res) => {
  if (!req.body?.title) return res.status(400).json({ error: "Article must have a title" });
  if (savedArticles.find(a => a.title === req.body.title)) {
    return res.status(400).json({ message: "Already saved" });
  }
  savedArticles.push(req.body);
  res.json({ message: "Saved successfully" });
});

app.delete("/api/saved/:title", (req, res) => {
  savedArticles = savedArticles.filter(a => a.title !== decodeURIComponent(req.params.title));
  res.json({ message: "Deleted successfully" });
});

// ── Sentiment ─────────────────────────────────────────────────────────────────
app.post("/api/sentiment", async (req, res) => {
  const { articles } = req.body;
  if (!articles?.length) return res.status(400).json({ error: "No articles provided" });

  const cacheKey = sentimentKey(articles);
  if (sentimentCache.has(cacheKey)) return res.json({ data: { labels: sentimentCache.get(cacheKey) } });

  if (!process.env.GEMINI_API_KEY) {
    const mock = ["positive", "neutral", "negative"];
    return res.json({ data: { labels: articles.map((_, i) => mock[i % 3]) } });
  }

  try {
    const prompt = `Classify each headline as exactly one of: positive, neutral, negative.
Return ONLY a JSON array in the same order. No explanation, no markdown, no code fences.

${articles.map((a, i) => `${i + 1}. "${a.title}"`).join("\n")}`;

    const data = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }).then(r => r.json());

    const labels = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "[]");
    sentimentCache.set(cacheKey, labels);
    res.json({ data: { labels } });
  } catch (err) {
    res.status(502).json({ error: "Gemini request failed" });
  }
});

// ── Summarize ─────────────────────────────────────────────────────────────────
app.post("/api/summarize", async (req, res) => {
  const { title, description, url } = req.body;

  if (url && summaryCache.has(url)) return res.json({ data: { bullets: summaryCache.get(url) } });

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ data: { bullets: [`${title?.slice(0, 80)}...`, "Add GEMINI_API_KEY to .env.", "Phase 2 feature."] } });
  }

  try {
    const prompt = `Summarise this news article in exactly 3 bullet points.
Each bullet must be under 15 words. Be concise and factual.
Return ONLY the 3 bullets as a JSON array of strings. No markdown, no explanation.

Title: ${title}
Description: ${description}`;

    const data = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }).then(r => r.json());

    const bullets = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().replace(/```json|```/g, "") || "[]");
    if (url) summaryCache.set(url, bullets);
    res.json({ data: { bullets } });
  } catch (err) {
    res.status(502).json({ error: "Gemini request failed" });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));