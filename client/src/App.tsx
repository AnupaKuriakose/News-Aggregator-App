import React from 'react';

import './App.css';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ArticleList } from './components/ArticleList';
import { SavedSidebar } from './components/SavedSidebar';

function App() {
   return (
    <div style={{ padding: "20px" }}>
      <Header />

      <CategoryTabs />

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 3 }}>
          <ArticleList />
        </div>

        <div style={{ flex: 1 }}>
          <SavedSidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
