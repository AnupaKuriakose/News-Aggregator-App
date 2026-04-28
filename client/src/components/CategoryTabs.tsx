type Props = {
  category: string;
  setCategory: (c: string) => void;
};

function CategoryTabs({ category, setCategory }: Props) {
  const tabs = ["technology", "business", "general"];

  return (
    <div style={{ marginBottom: "20px" }}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setCategory(t)}
          style={{
            marginRight: "10px",
            background: category === t ? "#ccc" : "#eee"
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;