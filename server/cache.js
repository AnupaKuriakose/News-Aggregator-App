//a single place for both summaryCache and sentimentCache. B
// oth controllers import from here, so there's no risk of them accidentally using separate Map instances.
export const summaryCache = new Map();
export const sentimentCache = new Map();

export function sentimentKey(articles) {
  return articles.map((a) => a.title).join("|");
}