import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = 5000;

let savedArticles = [];

// GET
app.get("/api/saved", (req, res) => {
  res.json(savedArticles);
});

// POST
app.post("/api/saved", (req, res) => {
  const article = req.body;

  const exists = savedArticles.find(a => a.title === article.title);
  if (exists) {
    return res.status(400).json({ message: "Already saved" });
  }

  savedArticles.push(article);
  res.json({ message: "Saved successfully" });
});

// DELETE
app.delete("/api/saved/:title", (req, res) => {
  const { title } = req.params;
  savedArticles = savedArticles.filter(a => a.title !== title);
  res.json({ message: "Deleted successfully" });
});

//testing
app.get("/api/models", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  
  );
  const data = await response.json();
  res.json(data);
});
//get sentiment for posts

app.post("/api/sentiment", async (req, res) => {
  const { articles } = req.body;

  console.log("1. Route hit");
  console.log("2. Articles received:", articles?.length);
  console.log("3. API key exists:", !!process.env.GEMINI_API_KEY);

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("4. No API key — returning mock");
    const mock = ["positive", "neutral", "negative"];
    const labels = articles.map((_, i) => mock[i % 3]);
    return res.json({ data: { labels } });
  }

  const numbered = articles
    .map((a, i) => `${i + 1}. "${a.title}"`)
    .join("\n");

  console.log("4. Sending to Gemini:", numbered.slice(0, 100));

  try {

    const prompt = `Classify each headline as exactly one of: positive, neutral, negative.
Return ONLY a JSON array in the same order. No explanation, no markdown, no code fences.

${numbered}`;
    const response = await fetch(
       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    const data = await response.json();
    console.log("5. Gemini raw response:", JSON.stringify(data).slice(0, 300));

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "[]";
    console.log("6. Extracted text:", text);

    const labels = JSON.parse(text);
    console.log("7. Parsed labels:", labels);

    return res.json({ data: { labels } });

  } catch (err) {
    console.error("Gemini error:", err.message);
    return res.status(502).json({ error: "Gemini request failed" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});