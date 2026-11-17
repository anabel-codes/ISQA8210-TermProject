import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, Scan, ArrowUpRight } from 'lucide-react';
import type { Property, PropertyImage } from '@prisma/client';
export function money(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
}
export function label(s: string) {
  return s
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
export function PropertyCard({
  property: p,
  featured = false,
}: {
  property: Property & { images: PropertyImage[] };
  featured?: boolean;
}) {
  return (
    <article className="property-card">
      <Link
        className="card-link"
        href={`/properties/${p.id}${featured ? '?from=featured' : ''}`}
        aria-label={`View ${p.title}`}
      >
        <div className="card-image">
          <Image
            src={p.images[0]?.url || '/images/placeholder.svg'}
            alt={p.images[0]?.alt || p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
          />
          <div className="card-badges">
            <span className={`badge ${p.status === 'ACTIVE' ? 'green' : ''}`}>
              {label(p.status)}
            </span>
            {p.sample && <span className="badge">Sample listing</span>}
          </div>
          <span className="image-arrow">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <div className="card-body">
          <div className="card-price">
            {money(p.priceCents)} <span>{label(p.type)}</span>
          </div>
          <h3>{p.title}</h3>
          <p>
            {p.street}, {p.city}, {p.state} {p.zip}
          </p>
          <div className="property-facts">
            <span>
              <BedDouble size={16} />
              {p.bedrooms ?? '—'} beds
            </span>
            <span>
              <Bath size={16} />
              {p.bathrooms ?? '—'} baths
            </span>
            <span>
              <Scan size={16} />
              {p.sqft?.toLocaleString() ?? '—'} sq ft
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
