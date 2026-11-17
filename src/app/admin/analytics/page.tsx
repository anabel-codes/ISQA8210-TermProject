import { requireAdminPage } from '@/lib/auth';
import { analyticsSummary } from '@/lib/analytics';
function Bars({ rows, empty }: { rows: [string, number][]; empty: string }) {
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return rows.length ? (
    <div className="bar-list">
      {rows.map(([name, n]) => (
        <div key={name} className="bar-row">
          <span>{name}</span>
          <div className="bar-track" aria-hidden="true">
            <div className="bar-fill" style={{ width: `${(n / max) * 100}%` }} />
          </div>
          <strong>{n}</strong>
        </div>
      ))}
    </div>
  ) : (
    <p>{empty}</p>
  );
}
export default async function Analytics() {
  await requireAdminPage();
  const data = await analyticsSummary();
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Interest, in perspective.</h1>
          <p>Recorded first-party activity over the last 30 days.</p>
        </div>
      </div>
      <div className="metric-grid">
        {[
          ['Property views', data.counts.VIEW],
          ['Search submissions', data.counts.SEARCH],
          ['Featured interactions', data.counts.FEATURED],
          ['Inquiry submissions', data.counts.INQUIRY],
        ].map(([title, n]) => (
          <div key={title} className="metric">
            <span>{title}</span>
            <strong>{n}</strong>
          </div>
        ))}
      </div>
      <div className="admin-panels">
        <section className="panel">
          <h2>Popular searches</h2>
          <Bars rows={data.popular} empty="No searches recorded yet." />
        </section>
        <section className="panel">
          <h2>Most viewed properties</h2>
          <Bars
            rows={data.views.map((v) => [v.title, v.count])}
            empty="No property views recorded yet."
          />
        </section>
        <section className="panel">
          <h2>Common filter preferences</h2>
          <Bars rows={Object.entries(data.filters)} empty="No filter observations yet." />
        </section>
        <section className="panel">
          <h2>Inquiry activity</h2>
          <Bars rows={Object.entries(data.days).sort()} empty="No inquiries recorded yet." />
        </section>
      </div>
      <p className="notice">
        Counts represent observed interactions, not unique people. Views and searches are
        deduplicated in each browser session for 30 minutes. Test events are separated. No browsing
        IP address or form message is stored in analytics. At most the latest 10,000 events are
        summarized; run the documented retention command to remove events older than 90 days.
      </p>
    </>
  );
}
