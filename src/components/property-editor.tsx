'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
import { propertySchema, statuses, propertyTypes } from '@/lib/validation';
import { label } from './property-card';
import type { Property, PropertyImage, PropertyFeature } from '@prisma/client';
type Editable = Omit<Property, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  features: PropertyFeature[];
};
type Photo = { url: string; alt: string; primary: boolean };
export function PropertyEditor({ property: p }: { property?: Editable }) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [images, setImages] = useState<Photo[]>(
    p?.images.map(({ url, alt, primary }) => ({ url, alt, primary })) ?? [],
  );
  const [draft, setDraft] = useState<Record<string, string>>(() => ({
    title: p?.title ?? '',
    street: p?.street ?? '',
    city: p?.city ?? '',
    state: p?.state ?? 'NE',
    zip: p?.zip ?? '',
    price: p ? String(p.priceCents / 100) : '',
    type: p?.type ?? 'HOUSE',
    status: p?.status ?? 'ACTIVE',
    bedrooms: String(p?.bedrooms ?? ''),
    bathrooms: String(p?.bathrooms ?? ''),
    sqft: String(p?.sqft ?? ''),
    lotSize: String(p?.lotSize ?? ''),
    lotUnit: p?.lotUnit ?? 'ACRES',
    yearBuilt: String(p?.yearBuilt ?? ''),
    latitude: String(p?.latitude ?? ''),
    longitude: String(p?.longitude ?? ''),
    description: p?.description ?? '',
    features: p?.features.map((f) => f.name).join('\n') ?? '',
  }));
  const [flags, setFlags] = useState({
    published: p?.published ?? false,
    featured: p?.featured ?? false,
    sample: p?.sample ?? true,
  });
  const change = (name: string, value: string) => setDraft((v) => ({ ...v, [name]: value }));
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  function move(i: number, delta: number) {
    const next = [...images];
    [next[i], next[i + delta]] = [next[i + delta], next[i]];
    setImages(next);
  }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setSaved(false);
    const data = new FormData(e.currentTarget);
    const raw = Object.fromEntries(data);
    const parsed = propertySchema.safeParse({
      ...raw,
      published: data.has('published'),
      featured: data.has('featured'),
      sample: data.has('sample'),
      features: String(data.get('features') ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      images,
    });
    if (!parsed.success) {
      setMessage(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
      return;
    }
    setBusy(true);
    let navigating = false;
    try {
      const res = await fetch(p ? `/api/admin/properties/${p.id}` : '/api/admin/properties', {
        method: p ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      if (!p) {
        navigating = true;
        router.push(`/admin/listings/${body.id}`);
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unable to save');
    } finally {
      if (!navigating) setBusy(false);
    }
  }
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage('');
    setBusy(true);
    const data = new FormData();
    data.set('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setImages([
        ...images,
        { url: body.url, alt: 'Property photograph', primary: images.length === 0 },
      ]);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }
  async function remove() {
    if (
      !p ||
      !window.confirm(
        `Permanently delete “${p.title}”? Inquiries will be preserved without a property link.`,
      )
    )
      return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/properties/${p.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: p.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/admin/listings');
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unable to delete');
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save}>
      <fieldset className="admin-form editor-fields" disabled={!hydrated || busy}>
        <h2>The essentials</h2>
        <label className="full">
          Listing title
          <input
            name="title"
            required
            minLength={3}
            maxLength={160}
            value={draft.title}
            onChange={(e) => change('title', e.target.value)}
          />
        </label>
        <label className="full">
          Street address
          <input
            name="street"
            required
            value={draft.street}
            onChange={(e) => change('street', e.target.value)}
          />
        </label>
        <label>
          City
          <input
            name="city"
            required
            value={draft.city}
            onChange={(e) => change('city', e.target.value)}
          />
        </label>
        <label>
          State
          <input
            name="state"
            pattern="[A-Z]{2}"
            maxLength={2}
            required
            value={draft.state}
            onChange={(e) => change('state', e.target.value)}
          />
        </label>
        <label>
          ZIP code
          <input
            name="zip"
            pattern="[0-9]{5}(-[0-9]{4})?"
            required
            value={draft.zip}
            onChange={(e) => change('zip', e.target.value)}
          />
        </label>
        <label>
          Price ($)
          <input
            name="price"
            type="number"
            min="0.01"
            max="20000000"
            step="0.01"
            required
            value={draft.price}
            onChange={(e) => change('price', e.target.value)}
          />
        </label>
        <label>
          Property type
          <select name="type" value={draft.type} onChange={(e) => change('type', e.target.value)}>
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Sale status
          <select
            name="status"
            value={draft.status}
            onChange={(e) => change('status', e.target.value)}
          >
            {statuses.map((t) => (
              <option value={t} key={t}>
                {label(t)}
              </option>
            ))}
          </select>
        </label>
        <h2>
          Space & details <span className="muted">(optional)</span>
        </h2>
        {[
          ['bedrooms', 'Bedrooms', p?.bedrooms, '1'],
          ['bathrooms', 'Bathrooms', p?.bathrooms, '0.5'],
          ['sqft', 'Interior square feet', p?.sqft, '1'],
          ['lotSize', 'Lot size', p?.lotSize, '0.01'],
          ['yearBuilt', 'Year built', p?.yearBuilt, '1'],
          ['latitude', 'Latitude', p?.latitude, 'any'],
          ['longitude', 'Longitude', p?.longitude, 'any'],
        ].map(([name, text, , step]) => (
          <label key={String(name)}>
            {text}
            <input
              name={String(name)}
              type="number"
              step={String(step)}
              value={draft[String(name)]}
              onChange={(e) => change(String(name), e.target.value)}
            />
          </label>
        ))}
        <label>
          Lot unit
          <select
            name="lotUnit"
            value={draft.lotUnit}
            onChange={(e) => change('lotUnit', e.target.value)}
          >
            <option value="ACRES">Acres</option>
            <option value="SQFT">Square feet</option>
          </select>
        </label>
        <label className="full">
          Description
          <textarea
            name="description"
            required
            minLength={30}
            maxLength={15000}
            rows={6}
            value={draft.description}
            onChange={(e) => change('description', e.target.value)}
          />
        </label>
        <label className="full">
          Features & amenities (one per line)
          <textarea
            name="features"
            rows={4}
            value={draft.features}
            onChange={(e) => change('features', e.target.value)}
          />
        </label>
        <h2>Photographs</h2>
        <p className="full form-note">
          Upload JPEG, PNG, or WebP files up to 8 MB. Images are re-encoded to remove metadata.
          Provide descriptive alt text and select a primary image. Move images to change gallery
          order.
        </p>
        <div className="image-editor full">
          {images.map((image, i) => (
            <div key={image.url + i} className="image-row">
              <Image src={image.url} alt={image.alt} width={95} height={70} unoptimized />
              <div className="image-row-content">
                <label>
                  Photograph {i + 1} alt text
                  <input
                    value={image.alt}
                    required
                    minLength={3}
                    maxLength={200}
                    onChange={(e) =>
                      setImages(images.map((v, j) => (j === i ? { ...v, alt: e.target.value } : v)))
                    }
                  />
                </label>
                <div className="image-row-actions">
                  <button
                    type="button"
                    className="icon-button"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    aria-pressed={image.primary}
                    onClick={() => setImages(images.map((v, j) => ({ ...v, primary: j === i })))}
                  >
                    {image.primary ? '✓ Primary' : 'Set primary'}
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() =>
                      setImages(
                        images
                          .filter((_, j) => j !== i)
                          .map((v, j) => ({ ...v, primary: image.primary ? j === 0 : v.primary })),
                      )
                    }
                  >
                    Remove photograph
                  </button>
                </div>
              </div>
            </div>
          ))}
          <label className="upload-label">
            Upload photograph
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy || images.length >= 30}
              onChange={upload}
            />
          </label>
        </div>
        <h2>Publication</h2>
        <label className="check">
          <input
            type="checkbox"
            name="published"
            checked={flags.published}
            onChange={(e) => setFlags({ ...flags, published: e.target.checked })}
          />{' '}
          Published publicly
        </label>
        <label className="check">
          <input
            type="checkbox"
            name="featured"
            checked={flags.featured}
            onChange={(e) => setFlags({ ...flags, featured: e.target.checked })}
          />{' '}
          Featured on homepage
        </label>
        <label className="check">
          <input
            type="checkbox"
            name="sample"
            checked={flags.sample}
            onChange={(e) => setFlags({ ...flags, sample: e.target.checked })}
          />{' '}
          Demonstration sample
        </label>
        {message && (
          <p className="error full" role="alert">
            {message}
          </p>
        )}
        {saved && (
          <p className="notice full" role="status">
            Listing saved successfully.
          </p>
        )}
        <div className="form-actions full">
          <button className="button" disabled={busy}>
            {busy ? 'Working…' : 'Save listing'}
          </button>
          <Link className="button secondary" href="/admin/listings">
            Back to listings
          </Link>
          {p && (
            <button className="button danger" type="button" disabled={busy} onClick={remove}>
              Delete listing
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
