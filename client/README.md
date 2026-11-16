# Newsly

A news aggregator built with React and Express. It fetches headlines by category, classifies each one as positive, neutral or negative with Gemini, and can summarise any article into three bullet points. An Analytics tab is being built on top of the sentiment data.

---

## Status at a glance

| Area | Status |
|------|--------|
| Category feed, search, article cards | Done |
| AI sentiment per article (server-cached) | Done |
| AI summarise button (server-cached) | Done |
| GNews proxied through the backend | Done |
| Navbar with Home and Analytics routes | Done |
| Sentiment summary cards (`StatCard` + `useSentimentStats`) | Done on Home, moving to Analytics |
| Saved articles | Client state only; server endpoints exist but are not wired in yet |
| Analytics charts and ranking | Next sprint |

---

## What changed since Phase 1

Phase 1 was a frontend-only MVP. These items were originally out of scope and are now in:

| Originally out of scope | Now |
|-------------------------|-----|
| AI summary | Live via `POST /api/summarize` (Gemini, cached by URL) |
| Backend / database | Express server. Saved articles are in memory by default; a MongoDB (Mongoose) variant is available |
| Smart sentiment search | Sentiment is classified per headline; sentiment filtering is on the backlog |
| Authentication | Still out of scope |

Other changes:

- The GNews API key no longer lives in the browser. The client calls the Express backend, which calls GNews.
- The client reads its API address from `REACT_APP_API_BASE_URL`.
- The app now has routing (`/` and `/analytics`) and a nav in the header.
- Search is derived data (`useMemo`) instead of state plus a second debounce, so counts always match what is on screen.

---

## Architecture

```
Browser (React, CRA)
   |
   |  REACT_APP_API_BASE_URL
   v
Express server
   |-- /api/news, /api/news/search  -->  GNews
   |-- /api/sentiment               -->  Gemini  (cache: joined headlines)
   |-- /api/summarize               -->  Gemini  (cache: article URL)
   '-- /api/saved                   -->  in-memory array, or MongoDB via index.mongo.js
```

Both caches are in-memory `Map`s and reset when the server restarts.

---

## Folder structure

```
client/
├── vercel.json                    # SPA rewrite so /analytics survives a refresh
└── src/
    ├── components/
    │   ├── ArticleCard.tsx        # Title, description, Save and AI Summarise buttons
    │   ├── ArticleList.tsx        # Renders ArticleCard list, loading and empty states
    │   ├── CategoryTabs.tsx       # technology / business / general tabs
    │   ├── Header.tsx             # Logo, Home/Analytics nav, search, Saved badge
    │   ├── Header.module.css
    │   ├── SavedSidebar.tsx       # Reading list panel
    │   ├── StatCard.tsx           # Reusable KPI tile (title, value, subtitle, accent)
    │   └── StatCard.module.css
    ├── hooks/
    │   └── useSentimentStats.ts   # Pure derived data: counts per sentiment, memoised
    ├── pages/
    │   ├── AnalyticsDashboard.tsx # Analytics route
    │   └── AnalyticsDashboard.module.css
    ├── services/
    │   └── api.ts                 # All HTTP calls to the Express backend
    ├── types/
    │   └── article.ts             # Article type definitions
    ├── App.tsx                    # Owns shared state and defines the routes
    ├── App.module.css
    ├── index.css
    ├── index.tsx                  # Entry point, wraps App in BrowserRouter
    └── react-app-env.d.ts

server/
├── index.js                       # Default server: all routes, saved articles in memory
├── index.mongo.js                 # Same routes, saved articles in MongoDB (Mongoose)
├── db.js                          # Mongo connection (used by index.mongo.js only)
├── cache.js                       # Sentiment and summary caches
├── models/Article.js              # Mongoose model (index.mongo.js only)
└── .env                           # Keys, never committed
```

---

## Component responsibilities

**Header** shows the logo, the Home and Analytics `NavLink`s, the search box and the Saved badge. It reports search text upward through `onSearch`.

**CategoryTabs** renders the three category buttons and highlights the active one.

**ArticleList / ArticleCard** render the feed. A card has Save and AI Summarise buttons; Summarise calls `POST /api/summarize` and shows the bullets inline.

**SavedSidebar** lists saved article titles.

**StatCard** is a presentational tile with no logic. Props: `title`, `value`, optional `subtitle`, optional `accent` (`primary`, `secondary`, `success`, `warning`, `danger`).

**useSentimentStats(articles)** takes one array and returns `{ total, positive, neutral, negative, pending }` from a single pass inside `useMemo`. `pending` counts articles whose sentiment has not arrived yet, so the four counts always add up to `total`. The same hook serves the feed now and the Analytics and Articles pages later.

**AnalyticsDashboard** is the `/analytics` page. Currently a placeholder.

---

## Data flow

```
App.tsx (shared state: category, saved, searchTerm, news query)
  |
  |-- Header          <- onSearch, savedCount; renders nav
  |
  '-- Routes
        |-- "/"          -> StatCards (via useSentimentStats)
        |                   CategoryTabs, ArticleList -> ArticleCard[], SavedSidebar
        '-- "/analytics" -> AnalyticsDashboard
```

State stays in `App` for now. If the Articles tab and Analytics page need more of it, it moves to context or dedicated hooks.

---

## API

### Backend endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/news?category=` | Top headlines from GNews |
| GET | `/api/news/search?q=` | GNews search |
| POST | `/api/sentiment` | Body `{ articles: [{ title }] }`, returns `{ data: { labels } }`; cached |
| POST | `/api/summarize` | Body `{ title, description, url }`, returns `{ data: { bullets } }`; cached |
| GET | `/api/saved` | All saved articles |
| POST | `/api/saved` | Save one; 400 if the title already exists |
| DELETE | `/api/saved/:title` | Remove by URL-encoded title |

### Client service functions (`services/api.ts`)

| Function | Calls |
|----------|-------|
| `fetchNewsByCategory(category)` | `GET /api/news` |
| `searchNews(query)` | `GET /api/news/search` (not used by the UI yet; search filters loaded articles on the client) |
| `classifySentiment(articles)` | `POST /api/sentiment` |
| `summarizeArticle(article)` | `POST /api/summarize` |
| `getSavedArticles()`, `saveArticle()`, `deleteArticle(title)` | `/api/saved` (written, not wired into `App` yet) |

---

## Running locally

```bash
# Terminal 1
cd server
npm install
npm run dev            # in-memory saved articles
# npm run dev:mongo    # MongoDB variant, needs MONGODB_URI

# Terminal 2
cd client
npm install
npm start
```

`server/.env`
```
PORT=5000
GNEWS_API_KEY=...
GEMINI_API_KEY=...       # optional, mock labels and summaries without it
MONGODB_URI=...          # only for index.mongo.js
```

`client/.env`
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

Before pushing, run `$env:CI="true"; npm run build` (PowerShell) or `CI=true npm run build`. Vercel treats lint warnings as errors.

---

## Deployment

- **Client:** Vercel, root directory `client`, Create React App preset, env var `REACT_APP_API_BASE_URL`. `client/vercel.json` rewrites all paths to `index.html` so refreshing `/analytics` works.
- **Server:** Render (or similar), root directory `server`, start command `npm start`. Free tier sleeps after about 15 minutes idle, so the first request can take around 30 seconds.

---

## Tickets

### Foundation (completed before Sprint 1)

| Ticket | Description |
|--------|-------------|
| NEWSLY-001 | Move GNews calls to the Express backend, remove the key from the client |
| NEWSLY-002 | Cache sentiment results on the server |
| NEWSLY-003 | Server variants: default in-memory `index.js` and optional `index.mongo.js`, switched by npm script |
| NEWSLY-004 | Client API base URL from `REACT_APP_API_BASE_URL` |
| NEWSLY-005 | CI-clean build: remove unused imports, fix `useEffect` dependencies |
| NEWSLY-006 | Search as derived data, remove the second debounce |

### Sprint 1: Analytics (in progress)

| Ticket | Description | Status |
|--------|-------------|--------|
| NEWSLY-101 | Analytics route and nav item (`react-router-dom`, `NavLink`s, `vercel.json` rewrite) | Done |
| NEWSLY-102 | Reusable `StatCard` component | Done |
| NEWSLY-103 | `useSentimentStats` hook and summary cards | Done on Home. Moving the cards to the Analytics page across all categories is the remaining part |

### Next sprint (finish Sprint 1)

| Ticket | Description | Acceptance |
|--------|-------------|------------|
| NEWSLY-103 (remainder) | Show the summary cards on `/analytics` using articles from all three categories | Counts update as sentiment loads; no extra API calls beyond one per category |
| NEWSLY-104 | Sentiment distribution bar chart per category (recharts) | Chart has an `aria-label`; sentiment is conveyed by shape and colour, not colour alone |
| NEWSLY-105 | Category ranking by share of positive articles | Handles zero-article categories |
| NEWSLY-106 | Skeleton loaders for the analytics section | No layout shift when data arrives |
| NEWSLY-107 | Error boundary around the analytics page | A chart crash shows a fallback, not a blank screen |
| NEWSLY-108 *(proposed)* | Data hook that loads all three categories and attaches sentiment, so the Analytics page can reuse the logic now inside `App` | `App` and Analytics share one hook |
| NEWSLY-109 *(proposed)* | Move percentage calculation into `useSentimentStats` | Every screen formats percentages the same way; no `NaN` when total is 0 |
| NEWSLY-110 *(proposed)* | Wire saved articles to `/api/saved` so the reading list survives a refresh | Saving and removing persists |
| NEWSLY-111 *(proposed)* | Sentiment filter on the feed (positive, neutral, negative) | Filter composes with category and search |

### Later sprints

| Sprint | Theme | Outline |
|--------|-------|---------|
| 2 | Better search | Natural-language queries, topic and sentiment extraction, sorting, date filters, better empty and error states |
| 3 | Ask Newsly | Question-and-answer panel, retrieve relevant articles, grounded Gemini answer with source links |
| 4 | Polish | Automated tests, responsive layout, screenshots and architecture diagram, README refresh, demo deployment |

---

## Known limitations

- Saved articles live in React state, so they reset on refresh. The server endpoints exist but are not connected yet (NEWSLY-110).
- Server caches and the default saved-articles store are in memory and reset on restart. Redis and MongoDB are the production answers.
- GNews returns up to 10 articles per request and the app has no pagination.
- The Analytics page currently has no content beyond a placeholder.
- Search filters the articles already loaded for the current category. It does not query GNews.