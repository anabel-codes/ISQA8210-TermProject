import Link from 'next/link';
import { requireAdminPage } from '@/lib/auth';
import { db } from '@/lib/db';
import { InquiryManager } from '@/components/inquiry-manager';
export default async function Inquiries({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdminPage();
  const query = await searchParams;
  const q = (query.q ?? '').slice(0, 100);
  const status = ['NEW', 'CONTACTED', 'RESOLVED'].includes(query.status ?? '')
    ? query.status
    : undefined;
  const where = {
    ...(status ? { status } : {}),
    ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {}),
  };
  const total = await db.inquiry.count({ where });
  const pages = Math.max(1, Math.ceil(total / 15));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(query.page) || 1)));
  const items = await db.inquiry.findMany({
    where,
    orderBy: { createdAt: query.sort === 'oldest' ? 'asc' : 'desc' },
    take: 15,
    skip: (page - 1) * 15,
    include: { property: { select: { id: true, title: true } } },
  });
  function url(n: number) {
    const params = new URLSearchParams({
      q,
      status: status ?? '',
      sort: query.sort ?? '',
      page: String(n),
    });
    return `/admin/inquiries?${params}`;
  }
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Every conversation matters.</h1>
          <p>{total} inquiries · Contact details are private to administrators.</p>
        </div>
      </div>
      <form className="admin-filter">
        <label>
          Search name or email
          <input name="q" defaultValue={q} />
        </label>
        <label>
          Status
          <select name="status" defaultValue={status ?? ''}>
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </label>
        <label>
          Sort
          <select name="sort" defaultValue={query.sort ?? 'newest'}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
        <button className="button">Filter inquiries</button>
        <Link href="/admin/inquiries" className="text-link">
          Clear filters
        </Link>
      </form>
      <div className="inquiry-list" style={{ marginTop: 25 }}>
        {items.map((item) => (
          <InquiryManager
            key={item.id}
            item={{ ...item, createdAt: item.createdAt.toISOString() }}
          />
        ))}
      </div>
      {!items.length && <div className="empty">No inquiries match these filters.</div>}
      <nav className="pagination" aria-label="Inquiry pages">
        {page > 1 && (
          <Link href={url(page - 1)} className="button secondary">
            Previous
          </Link>
        )}
        <span>
          Page {page} of {pages}
        </span>
        {page < pages && (
          <Link href={url(page + 1)} className="button secondary">
            Next
          </Link>
        )}
      </nav>
    </>
  );
}
