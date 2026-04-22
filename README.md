
# Focused News Aggregator

A full-stack application that aggregates news from external APIs and allows users to save and manage articles.

## 🚀 Features
- Fetch news from external API
- Search by keyword
- Save articles
- Delete saved articles
- Mark as favorite/read

## 🛠️ Tech Stack
- Frontend: React
- Backend: Node.js, Express
- API: GNews API

## 📂 Project Structure
- frontend/ → React app
- backend/ → Node API

## ▶️ Run Locally

### Backend
cd backend
npm install
node server.js

### Frontend
cd frontend
npm install
npm start

## 🔗 API Endpoints

GET /api/news?q=keyword  
POST /api/saved  
GET /api/saved  
DELETE /api/saved/:id  
PUT /api/saved/:id  
