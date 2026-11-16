import React, { useState, useRef, useEffect } from "react";
import { TbMenu2 } from "react-icons/tb";
import styles from "./Header.module.css";

const MenuIcon = TbMenu2 as React.ElementType;

type Props = {
  onSearch: (q: string) => void;
  savedCount: number;
  onToggleSaved?: () => void;
  onMenuClick?: () => void;
};

function Header({ onSearch, savedCount, onToggleSaved, onMenuClick }: Props) {
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  });

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
      <button type="button" className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
        <MenuIcon size={22} />
      </button>

      <span className={styles.date}>{today}</span>

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
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear">×</button>
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