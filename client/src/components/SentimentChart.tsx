import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Article } from "../types/article";
import { computeSentimentStats } from "../hooks/useSentimentStats";

type Props = { byCategory: Record<string, Article[]> };

const label = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

function SentimentChart({ byCategory }: Props) {
  const data = Object.entries(byCategory).map(([category, articles]) => {
    const s = computeSentimentStats(articles);
    return { category: label(category), Positive: s.positive, Neutral: s.neutral, Negative: s.negative };
  });

  const summary = data
    .map((d) => `${d.category}: ${d.Positive} positive, ${d.Neutral} neutral, ${d.Negative} negative`)
    .join(". ");

  return (
    <div role="img" aria-label={`Bar chart of article sentiment by category. ${summary}`}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" tick={{ fill: "var(--color-text-secondary)" }} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--color-text-secondary)" }} />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <Legend wrapperStyle={{ color: "var(--color-text-secondary)" }} />
          <Bar dataKey="Positive" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Neutral" fill="var(--color-text-muted)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Negative" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SentimentChart;