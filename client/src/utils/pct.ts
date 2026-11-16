export const pct = (n: number, total: number) =>
  total > 0 ? Math.round((n / total) * 100) : 0;