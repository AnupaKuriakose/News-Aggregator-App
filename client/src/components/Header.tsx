import React, { useState } from "react";
import styles from './Header.module.css';

type Props = {
    onSearch: (q: string) => void;
    savedCount: number;
};

function Header({ onSearch, savedCount }: Props) {
    const [inputValue, setInputValue] = useState('');
    const handleClear = () => {
        setInputValue('');
        onSearch('');
    };
    return (
        <header className={styles.header}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2>📰 News Aggregator</h2></div>
            <div className={styles.searchWrap}>
                <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search news..."
                    aria-label="Search articles"
                    value={inputValue}
                    onChange={(e) => {
                        const value = e.target.value;
                        setInputValue(value); 
                        onSearch(value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onSearch((e.target as HTMLInputElement).value);
                        }
                    }}

                />
                {inputValue && (<button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">x</button>)}

            </div>

            <div>Saved ({savedCount})</div>

        </header>
    );
}

export default Header;