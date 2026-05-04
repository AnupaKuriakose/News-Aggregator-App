import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import { TbNews } from "react-icons/tb"; 
const NewsIcon = TbNews as React.ElementType;

type Props = {
  onSearch: (q: string) => void;
  savedCount: number;
  onToggleSaved?: () => void;
};

function Header({ onSearch, savedCount, onToggleSaved }: Props) {
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 400);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <header className={styles.header}>
     <div className={styles.logo}>
  <NewsIcon size={35} color="#378ADD" />
  <span className={styles.logoText}>Newsly</span>
</div>

      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search news…"
          aria-label="Search articles"
          value={inputValue}
          onChange={handleChange}
        />
        {inputValue && (
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear">
            ×
          </button>
        )}
      </div>

      <button className={styles.savedBtn} onClick={onToggleSaved}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        Saved
        {savedCount > 0 && <span className={styles.badge}>{savedCount}</span>}
      </button>
    </header>
  );
}

export default Header;
