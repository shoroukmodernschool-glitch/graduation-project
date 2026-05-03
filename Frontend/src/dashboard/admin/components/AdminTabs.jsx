export default function AdminTabs({ tabs, page, setPage, formatTabName }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t}
          className={`tab ${page === t ? "active" : ""}`}
          onClick={() => setPage(t)}
        >
          {formatTabName(t)}
        </button>
      ))}
    </div>
  );
}