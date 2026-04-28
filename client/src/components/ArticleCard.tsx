import { Article } from "../types/article";

type Props = {
  article: Article;
  onSave: (a: Article) => void;
  isSaved: boolean;
};

function ArticleCard({ article, onSave, isSaved }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", marginBottom: "15px", padding: "10px" }}>
      <h4>{article.title}</h4>
      <p>{article.description}</p>

      <button onClick={() => onSave(article)}>
        {isSaved ? "✓ Saved" : "+ Save"}
      </button>

      <button style={{ marginLeft: "10px" }}>AI Summarize</button>
    </div>
  );
}

export default ArticleCard;