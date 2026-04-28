import { Article } from "../types/article";
import ArticleCard from "./ArticleCard";

type Props = {
  articles: Article[];
  saved: Article[];
  onSave: (a: Article) => void;
};

function ArticleList({ articles, saved, onSave }: Props) {
  return (
    <div>
      {articles.map((a, i) => (
        <ArticleCard
          key={i}
          article={a}
          onSave={onSave}
          isSaved={saved.some((s) => s.title === a.title)}
        />
      ))}
    </div>
  );
}

export default ArticleList;