export default function Loading() {
  return (
    <div className="section" role="status" aria-label="Loading page">
      <div className="skeleton" />
      <div className="property-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton card-skeleton" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
