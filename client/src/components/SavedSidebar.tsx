import { Article } from "../types/article";
type Props = {
  saved: Article[];
};

function SavedSidebar({ saved }: Props) {
  return (
    <div>
      <h4>Reading List</h4>
      {saved.map((a, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          {a.title}
        </div>
      ))}
    </div>
  );
}

export default SavedSidebar;