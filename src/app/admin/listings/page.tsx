import Link from 'next/link';
import { requireAdminPage } from '@/lib/auth';
import { findProperties } from '@/lib/properties';
import type { Query } from '@/lib/search';
import { SearchForm } from '@/components/search-form';
import { money, label } from '@/components/property-card';
export default async function Listings({ searchParams }: { searchParams: Promise<Query> }) {
  await requireAdminPage();
  const query = await searchParams;
  const { items, total, page, pages } = await findProperties(query, true);
  function pageUrl(n: number) {
    const p = new URLSearchParams(
      Object.entries(query).map(([k, v]) => [k, Array.isArray(v) ? v[0] : (v ?? '')]),
    );
    p.set('page', String(n));
    return `/admin/listings?${p}`;
  }
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Property listings</h1>
          <p>{total} records, including drafts and sample listings.</p>
        </div>
        <Link href="/admin/listings/new" className="button">
          Add listing
        </Link>
      </div>
      <SearchForm query={query} admin />
      <div className="results-heading">
        <span>
          Page {page} of {pages}
        </span>
        <Link className="text-link" href="/admin/listings">
          Clear filters
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Price</th>
              <th>Status</th>
              <th>Publication</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.title}
                  <small>
                    {p.city}, {p.state}
                    {p.sample ? ' · Sample' : ''}
                    {p.featured ? ' · Featured' : ''}
                  </small>
                </td>
                <td>{money(p.priceCents)}</td>
                <td>{label(p.status)}</td>
                <td>
                  <span className={`badge ${p.published ? 'green' : ''}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/listings/${p.id}`}>Edit listing</Link>
                  {p.published && (
                    <small>
                      <Link href={`/properties/${p.id}`}>View public page</Link>
                    </small>
                  )}
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={5}>No listings match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav className="pagination" aria-label="Administrative listing pages">
        {page > 1 && (
          <Link href={pageUrl(page - 1)} className="button secondary">
            Previous
          </Link>
        )}
        {page < pages && (
          <Link href={pageUrl(page + 1)} className="button secondary">
            Next
          </Link>
        )}
      </nav>
    </>
  );
}
