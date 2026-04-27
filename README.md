# 📰 Focused News Aggregator

A full-stack web application that aggregates news from multiple sources, allows users to search intelligently, generate AI-powered summaries, and save articles for later reading.

---

## 🚀 Features

### 🔹 Core Features

* Fetch news from multiple categories:

  * Technology
  * Finance (Business)
  * General
* Display articles in a clean, card-based UI
* Save articles to a personalized reading list

### 🔹 Advanced Features

* 🤖 AI-powered article summaries (3 bullet points)
* 🔍 Smart search with sentiment filtering
  *(e.g., "positive news about Angular")*
* ⭐ Saved articles view (reading list)

---

## 🛠️ Tech Stack

### Frontend

* React (TypeScript)
* Axios

### Backend

* Node.js
* Express

### APIs & Services

* News API (GNews or similar)
* AI Model (Google Gemini)

---

## 📁 Project Structure

```
news-aggregator/
  client/        # React frontend
  server/        # Node.js + Express backend
  .gitignore
  README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/news-aggregator.git
cd news-aggregator
```

---

### 2️⃣ Setup Frontend

```
cd client
npm install
npm start
```

---

### 3️⃣ Setup Backend

```
cd server
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` files in both `client/` and `server/`.

### 📍 client/.env

```
REACT_APP_NEWS_API_KEY=your_news_api_key
```

### 📍 server/.env

```
PORT=5000
NEWS_API_KEY=your_news_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🔗 API Endpoints (Planned)

### News

* `GET /api/news?q=keyword&category=type`

### Saved Articles

* `GET /api/saved`
* `POST /api/saved`
* `DELETE /api/saved/:id`

### AI Summary

* `POST /api/summarize`

---

## 🧠 Future Enhancements

* Add MongoDB for persistent storage
* User authentication (JWT)
* Pagination and infinite scroll
* Improved sentiment analysis using AI
* Deploy frontend and backend

---

## 💡 Project Goal

This project demonstrates:

* Full-stack development (React + Node.js)
* API integration
* CRUD operations
* AI integration in real-world applications

---

## 📌 Status

🚧 In Progress

---

## 👤 Author

Your Name
GitHub: https://github.com/your-username
