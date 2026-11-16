import { Article } from "../types/article";
import { computeSentimentStats } from "../hooks/useSentimentStats";
import { pct } from "../utils/pct";

type Props = { byCategory: Record<string, Article[]> };

function CategoryRanking({ byCategory }: Props) {
  const rows = Object.entries(byCategory)
    .map(([category, articles]) => {
      const s = computeSentimentStats(articles);
      const classified = s.total - s.pending;
      return { category, classified, share: pct(s.positive, classified) };
    })
    .sort((a, b) => b.share - a.share);

  return (
    <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
      {rows.map((r) => (
        <li key={r.category}>
          <strong style={{ textTransform: "capitalize" }}>{r.category}</strong>
          {" — "}
          {r.classified === 0 ? "analysing…" : `${r.share}% positive`}
        </li>
      ))}
    </ol>
  );
}

export default CategoryRanking;