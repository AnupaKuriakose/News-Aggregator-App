import styles from "./CategoryTabs.module.css";

type Tab = { value: string; label: string };

const TABS: Tab[] = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Finance" },
  { value: "general", label: "General" },
];

type Props = {
  category: string;
  setCategory: (c: string) => void;
};

function CategoryTabs({ category, setCategory }: Props) {
  return (
    <nav className={styles.nav} aria-label="News categories">
      <div className={styles.tabList} role="tablist">
        {TABS.map((t) => {
          const active = category === t.value;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              onClick={() => setCategory(t.value)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default CategoryTabs;