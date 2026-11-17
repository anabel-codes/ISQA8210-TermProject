import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BedDouble, Bath, Scan, MapPin, Check, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { imageInclude } from '@/lib/properties';
import { Gallery } from '@/components/gallery';
import { InquiryForm } from '@/components/inquiry-form';
import { PropertyCard, money, label } from '@/components/property-card';
import { EventTracker } from '@/components/event-tracker';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const p = await db.property.findFirst({
    where: { id: (await params).id, published: true },
    select: { title: true },
  });
  return { title: p?.title ?? 'Property unavailable' };
}
export default async function Detail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const p = await db.property.findFirst({
    where: { id: (await params).id, published: true },
    include: imageInclude,
  });
  if (!p) notFound();
  const related = await db.property.findMany({
    where: { published: true, id: { not: p.id }, type: p.type },
    include: imageInclude,
    take: 3,
  });
  return (
    <div className="section detail">
      <EventTracker kind="VIEW" propertyId={p.id} />
      {(await searchParams).from === 'featured' && (
        <EventTracker kind="FEATURED" propertyId={p.id} />
      )}
      <Link href="/properties" className="text-link">
        <ArrowLeft size={16} /> Back to properties
      </Link>
      <div className="detail-heading">
        <div>
          <div className="inline-badges">
            <span className="badge green">{label(p.status)}</span>
            {p.sample && <span className="badge">Sample listing · Not actual inventory</span>}
          </div>
          <h1>{p.title}</h1>
          <p>
            <MapPin size={17} />
            {p.street}, {p.city}, {p.state} {p.zip}
          </p>
        </div>
        <div className="detail-price">
          {money(p.priceCents)}
          <small>{label(p.type)}</small>
        </div>
      </div>
      {p.sample && (
        <p className="sample-note">
          Fictional demonstration listing. Images are illustrative and do not depict real estate
          inventory at this address.
        </p>
      )}
      <Gallery images={p.images} />
      <div className="detail-columns">
        <div>
          <div className="detail-facts">
            <span>
              <BedDouble />
              {p.bedrooms ?? '—'}
              <small>Bedrooms</small>
            </span>
            <span>
              <Bath />
              {p.bathrooms ?? '—'}
              <small>Bathrooms</small>
            </span>
            <span>
              <Scan />
              {p.sqft?.toLocaleString() ?? '—'}
              <small>Interior sq ft</small>
            </span>
          </div>
          <h2>Make yourself at home.</h2>
          <p className="description">{p.description}</p>
          <h3>Details that make a difference</h3>
          <ul className="features-list">
            {p.features.map((f) => (
              <li key={f.id}>
                <Check size={16} />
                {f.name}
              </li>
            ))}
          </ul>
          <dl className="specs">
            <div>
              <dt>Property type</dt>
              <dd>{label(p.type)}</dd>
            </div>
            <div>
              <dt>Year built</dt>
              <dd>{p.yearBuilt ?? 'Not provided'}</dd>
            </div>
            <div>
              <dt>Lot size</dt>
              <dd>{p.lotSize ? `${p.lotSize} ${label(p.lotUnit ?? '')}` : 'Not provided'}</dd>
            </div>
            <div>
              <dt>Listing ID</dt>
              <dd>{p.id}</dd>
            </div>
            <div>
              <dt>Listed</dt>
              <dd>{p.createdAt.toLocaleDateString('en-US')}</dd>
            </div>
            {p.latitude !== null && p.longitude !== null && (
              <div>
                <dt>Coordinates</dt>
                <dd>
                  {p.latitude}, {p.longitude}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <aside className="inquiry-box" id="inquire">
          <p className="eyebrow">PICTURE YOURSELF HERE?</p>
          <h2>Let’s talk about it.</h2>
          <p>Ask a question about this property.</p>
          <InquiryForm propertyId={p.id} />
        </aside>
      </div>
      {related.length > 0 && (
        <section className="related">
          <div className="section-heading">
            <h2>A few more possibilities.</h2>
            <Link className="text-link" href="/properties">
              See all properties
            </Link>
          </div>
          <div className="property-grid">
            {related.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
