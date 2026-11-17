import type { Metadata } from 'next';
import Link from 'next/link';
import { findProperties } from '@/lib/properties';
import type { Query } from '@/lib/search';
import { PropertyCard } from '@/components/property-card';
import { SearchForm } from '@/components/search-form';
import { EventTracker } from '@/components/event-tracker';
export const metadata: Metadata = { title: 'Explore properties' };
export default async function Properties({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const { items, total, page, pages } = await findProperties(query);
  const plain = Object.fromEntries(
    Object.entries(query).map(([k, v]) => [k, Array.isArray(v) ? v[0] : (v ?? '')]),
  );
  function url(n: number) {
    const params = new URLSearchParams(plain);
    params.set('page', String(n));
    return `/properties?${params}`;
  }
  return (
    <div className="section catalog">
      <div className="page-heading">
        <p className="eyebrow">FIND YOUR NEXT CHAPTER</p>
        <h1>Room for possibility.</h1>
        <p>Find a space that fits the way you want to live.</p>
      </div>
      <SearchForm query={query} />
      <div className="results-heading">
        <p>
          <strong>{total}</strong> {total === 1 ? 'property' : 'properties'} found{' '}
          <span className="muted"> · Sample inventory</span>
        </p>
        <Link href="/properties" className="text-link">
          Clear filters
        </Link>
      </div>
      {query.searched === 'true' && <EventTracker kind="SEARCH" query={plain} />}
      <p className="sample-note">
        All seeded listings are fictional. Images are illustrative and do not depict real estate
        inventory at the listed addresses. Reversed numerical ranges are automatically normalized.
      </p>
      {items.length ? (
        <div className="property-grid">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No properties match just yet.</h2>
          <p>Try a wider price range or a different location.</p>
          <Link className="button" href="/properties">
            Reset your search
          </Link>
        </div>
      )}
      <nav className="pagination" aria-label="Property pages">
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
    </div>
  );
}
