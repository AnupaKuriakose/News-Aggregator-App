import styles from "./CategoryTabs.module.css";
import { FaKeyboard, FaGlobe } from "react-icons/fa";
import { MdTimeline } from "react-icons/md";
import { ReactNode } from "react";
import { IconType } from "react-icons"; 

interface Tab {
  value: string;
  label: string;
  icon: IconType; // Change this to ReactNode
}

type Props = {
  category: string;
  setCategory: (c: string) => void;
};

// Render the icons directly in the array
const TABS: Tab[] = [
  { value: "technology", label: "Technology", icon: FaKeyboard },
  { value: "business", label: "Finance", icon: MdTimeline },
  { value: "general", label: "General", icon: FaGlobe },
];

function CategoryTabs({ category, setCategory }: Props) {
  return (
    <nav className={styles.nav} aria-label="News categories">
      <div className={styles.tabList} role="tablist">
        {TABS.map((t) => {
          const Icon = t.icon as any; // Define the component
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={category === t.value}
              className={`${styles.tab} ${category === t.value ? styles.tabActive : ""}`}
              onClick={() => setCategory(t.value)}
            >
              <span className={styles.tabIcon}>
                <Icon size={20} />
              </span>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default CategoryTabs;
