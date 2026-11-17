import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAdminPage } from '@/lib/auth';
import { analyticsSummary } from '@/lib/analytics';
import { label } from '@/components/property-card';
export default async function Dashboard() {
  await requireAdminPage();
  const [all, active, pending, sold, featured, newInquiries, recent, analytics] = await Promise.all(
    [
      db.property.count(),
      db.property.count({ where: { status: 'ACTIVE' } }),
      db.property.count({ where: { status: 'PENDING' } }),
      db.property.count({ where: { status: 'SOLD' } }),
      db.property.count({ where: { featured: true } }),
      db.inquiry.count({ where: { status: 'NEW' } }),
      db.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { property: { select: { title: true } } },
      }),
      analyticsSummary(),
    ],
  );
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>A clear view of what’s next.</h1>
          <p>Manage your inventory and keep every conversation moving.</p>
        </div>
        <Link className="button" href="/admin/listings/new">
          Add a listing
        </Link>
      </div>
      <div className="metric-grid">
        {[
          ['Total listings', all],
          ['Active', active],
          ['Pending', pending],
          ['Sold', sold],
          ['Featured', featured],
          ['New inquiries', newInquiries],
          ['Views · 30 days', analytics.counts.VIEW],
          ['Searches · 30 days', analytics.counts.SEARCH],
        ].map(([title, value]) => (
          <div className="metric" key={title}>
            <span>{title}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="admin-panels">
        <section className="panel">
          <h2>Latest conversations</h2>
          {recent.length ? (
            <div>
              {recent.map((i) => (
                <p key={i.id}>
                  <Link
                    className="text-link"
                    href={`/admin/inquiries?q=${encodeURIComponent(i.email)}`}
                  >
                    {i.name} · {label(i.status)}
                  </Link>
                  <br />
                  {i.property?.title ?? 'General inquiry'} ·{' '}
                  {i.createdAt.toLocaleDateString('en-US')}
                </p>
              ))}
            </div>
          ) : (
            <p>No inquiries yet. New messages will appear here.</p>
          )}
          <Link href="/admin/inquiries" className="text-link">
            View inquiries →
          </Link>
        </section>
        <section className="panel">
          <h2>Inquiry activity</h2>
          <p>Recorded inquiry submissions over the last 30 days.</p>
          {Object.keys(analytics.days).length ? (
            <ul>
              {Object.entries(analytics.days)
                .sort()
                .map(([day, n]) => (
                  <li key={day}>
                    {day}: {n} {n === 1 ? 'inquiry' : 'inquiries'}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No recorded inquiry activity yet.</p>
          )}
          <Link href="/admin/analytics" className="text-link">
            Explore analytics →
          </Link>
        </section>
      </div>
      <p className="notice">
        Inventory includes clearly labeled sample data. Analytics reflect recorded events only; test
        events are excluded in normal operation.
      </p>
    </>
  );
}
