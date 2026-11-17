import { Search, ArrowUpRight } from 'lucide-react';
import { parseSearch, type Query } from '@/lib/search';
import { label } from './property-card';
import { propertyTypes, statuses } from '@/lib/validation';
export function SearchForm({
  query = {},
  compact = false,
  admin = false,
}: {
  query?: Query;
  compact?: boolean;
  admin?: boolean;
}) {
  const s = parseSearch(query);
  return (
    <form
      action={admin ? '/admin/listings' : '/properties'}
      className={compact ? 'hero-search' : 'search-panel'}
    >
      <input type="hidden" name="searched" value="true" />
      <label className="location-label">
        {compact ? 'Where do you want to live?' : 'Location or keyword'}
        <span className="input-icon">
          <Search size={18} />
          <input name="q" placeholder="City, address, or ZIP code" defaultValue={s.q} />
        </span>
      </label>
      {!compact && (
        <>
          <label>
            Min price ($)
            <input name="min" type="number" min="0" max="20000000" defaultValue={s.min} />
          </label>
          <label>
            Max price ($)
            <input name="max" type="number" min="0" max="20000000" defaultValue={s.max} />
          </label>
          <label>
            Bedrooms
            <select aria-label="Bedrooms" name="bedrooms" defaultValue={s.bedrooms ?? ''}>
              <option value="">Any beds</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}+ beds
                </option>
              ))}
            </select>
          </label>
          <label>
            Bathrooms
            <select aria-label="Bathrooms" name="bathrooms" defaultValue={s.bathrooms ?? ''}>
              <option value="">Any baths</option>
              {[1, 1.5, 2, 2.5, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+ baths
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      <label>
        Property type
        <select aria-label="Property type" name="type" defaultValue={s.type ?? ''}>
          <option value="">All property types</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>
              {label(t)}
            </option>
          ))}
        </select>
      </label>
      {!compact && (
        <>
          <label>
            Status
            <select aria-label="Status" name="status" defaultValue={s.status ?? ''}>
              <option value="">All statuses</option>
              {statuses.map((t) => (
                <option key={t} value={t}>
                  {label(t)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Min square feet
            <input name="minSqft" type="number" min="0" defaultValue={s.minSqft} />
          </label>
          <label>
            Max square feet
            <input name="maxSqft" type="number" min="0" defaultValue={s.maxSqft} />
          </label>
          <label>
            Sort by
            <select aria-label="Sort by" name="sort" defaultValue={s.sort}>
              <option value="newest">Newest listed</option>
              <option value="oldest">Oldest listed</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="size">Largest first</option>
            </select>
          </label>
          <label className="check">
            <input type="checkbox" name="featured" value="true" defaultChecked={s.featured} />
            Featured only
          </label>
        </>
      )}
      <button className="button">
        {compact ? 'Find your place' : 'Apply filters'}
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
