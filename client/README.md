🎯 Phase 1: Requirements (MVP)
🟢 Goal

Build a working frontend that:

- Fetches news
- Displays articles
- Allows basic search
- Shows category-based results

📌 Functional Requirements

🟢 1. Initial Load
Fetch articles automatically
Default category:
technology (recommended)
🟢 2. Category Switching
Buttons:
Tech
Finance
General
Clicking → fetch new articles
1. Categories
User can select:
Technology
Finance (business)
General

2. Search
User enters keyword
App fetches related news
3. Article List

Each article should display:

Title
Description
Source (optional)
Buttons:
Save (UI only for now)
Summarize (placeholder)

4. Basic UI States
Loading state
Empty state (“No results found”)

❌ Out of Scope (Phase 1)
AI summary
Backend/database
Authentication
Smart sentiment search

Folder Structure
client/src/
├── components/
│   ├── ArticleCard.tsx       # Individual article — title, description, Save + AI Summarise buttons
│   ├── ArticleList.tsx       # Renders the list of ArticleCard components
│   ├── CategoryTabs.tsx      # technology / business / general tab buttons
│   ├── Header.tsx            # App title, search input, Saved badge
│   ├── Header.module.css     # Scoped styles for Header
│   └── SavedSidebar.tsx      # Reading list panel (right side)
│
├── services/
│   └── api.ts                # All axios calls — fetchNews, saveArticle, summarise etc.
│
├── types/
│   └── article.ts            # Article, SavedArticle, NewsCategory type definitions
│
├── App.tsx                   # Root component — wires everything together
├── App.module.css            # Scoped styles for App layout
├── index.css                 # Global reset and base styles
├── index.tsx                 # React DOM entry point
└── react-app-env.d.ts        # CRA type declarations

Component Responsibilities
Header

Displays the app title and search input
Shows Saved (n) badge — count updates as user saves articles
Passes search query up to App.tsx via onSearch prop

CategoryTabs

Three buttons: technology, business, general
Clicking a tab calls onCategoryChange in App.tsx, which triggers a new API fetch
Active tab is highlighted

ArticleList

Receives the articles array and renders an ArticleCard for each
Handles loading state and empty state

ArticleCard

Displays title, description, source, and age
Save button — calls onSave prop, updates reading list in App.tsx
AI Summarise button — calls POST /api/summarize via services/api.ts, shows bullet points inline

SavedSidebar

Shown on the right when user has saved articles
Lists saved article titles with a remove option
Receives saved array and onRemove from App.tsx


Data Flow
App.tsx
  │
  ├── category state → CategoryTabs (controls which tab is active)
  ├── query state    → Header (search input)
  ├── articles state → ArticleList → ArticleCard[]
  └── saved state    → SavedSidebar
                        ArticleCard (isSaved prop)
All state lives in App.tsx. Components are stateless where possible and communicate via props.

Services
services/api.ts
All backend calls go through here — no axios calls scattered in components.
FunctionMethodEndpointDescriptionfetchNews(category, query?)GET/api/newsFetch articles by category or keywordsaveArticle(article)POST/api/savedAdd article to reading listremoveSaved(id)DELETE/api/saved/:idRemove from reading listsummariseArticle(title, desc)POST/api/summarizeGet 3 AI bullet pointsclassifySentiment(titles)POST/api/sentimentBatch sentiment labels (Phase 2)