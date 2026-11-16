import React from "react";
import { NavLink } from "react-router-dom";
import {
  TbNews, TbHome, TbChartBar, TbMoon, TbSun,
  TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { useTheme } from "../context/ThemeContext";
import styles from "./Sidebar.module.css";

const NewsIcon = TbNews as React.ElementType;
const HomeIcon = TbHome as React.ElementType;
const ChartIcon = TbChartBar as React.ElementType;
const MoonIcon = TbMoon as React.ElementType;
const SunIcon = TbSun as React.ElementType;
const CollapseIcon = TbLayoutSidebarLeftCollapse as React.ElementType;
const ExpandIcon = TbLayoutSidebarLeftExpand as React.ElementType;

// Add future pages (For you, Saved, My interests) by adding a row here
const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: HomeIcon, end: true },
  { to: "/analytics", label: "Analytics", Icon: ChartIcon, end: false },
];

type Props = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
};

function Sidebar({ collapsed, onToggleCollapse, mobileOpen }: Props) {
  const { theme, toggleTheme } = useTheme();
  const ThemeIcon = theme === "dark" ? SunIcon : MoonIcon;
  const ToggleIcon = collapsed ? ExpandIcon : CollapseIcon;
  const themeLabel = theme === "dark" ? "Light mode" : "Dark mode";

  const cls = [
    styles.sidebar,
    collapsed ? styles.collapsed : "",
    mobileOpen ? styles.mobileOpen : "",
  ].join(" ");

  return (
    <aside className={cls}>
      <div className={styles.logo}>
        <NewsIcon size={26} color="var(--color-accent)" />
        <span className={`${styles.label} ${styles.logoText}`}>Newsly</span>
      </div>

      <nav aria-label="Main" className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <Icon size={20} />
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.spacer} />

      <button type="button" className={styles.link} onClick={toggleTheme}
        aria-label={themeLabel} title={collapsed ? themeLabel : undefined}>
        <ThemeIcon size={20} />
        <span className={styles.label}>{themeLabel}</span>
      </button>

      <button type="button" className={`${styles.link} ${styles.collapseBtn}`}
        onClick={onToggleCollapse} aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : undefined}>
        <ToggleIcon size={20} />
        <span className={styles.label}>Collapse</span>
      </button>
    </aside>
  );
}

export default Sidebar;