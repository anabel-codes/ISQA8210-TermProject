'use client';
import Link from 'next/link';
import { useState } from 'react';
export function InquiryManager({
  item,
}: {
  item: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    status: string;
    notes: string;
    createdAt: string;
    property: { id: string; title: string } | null;
  };
}) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <article className="inquiry-record">
      <header>
        <div>
          <h2>{item.name}</h2>
          <p className="contact-line">
            <a href={`mailto:${item.email}`}>{item.email}</a>
            {item.phone && (
              <>
                {' '}
                · <a href={`tel:${item.phone}`}>{item.phone}</a>
              </>
            )}
            <br />
            {new Date(item.createdAt).toLocaleString('en-US')}
          </p>
        </div>
        <span>
          <span className="badge green">{status}</span>
        </span>
      </header>
      <p>
        {item.property ? (
          <Link className="text-link" href={`/admin/listings/${item.property.id}`}>
            {item.property.title} →
          </Link>
        ) : (
          'General inquiry'
        )}
      </p>
      <p>{item.message}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMessage('');
          try {
            const res = await fetch(`/api/admin/inquiries/${item.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status, notes }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setError(false);
            setMessage('Inquiry updated.');
          } catch (e) {
            setError(true);
            setMessage(e instanceof Error ? e.message : 'Unable to save');
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Status
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </label>
        <label>
          Internal notes
          <textarea
            rows={2}
            maxLength={5000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <button className="button" disabled={busy}>
          {busy ? 'Saving…' : 'Save inquiry'}
        </button>
      </form>
      {message && (
        <p role={error ? 'alert' : 'status'} className={error ? 'error' : 'notice'}>
          {message}
        </p>
      )}
    </article>
  );
}
