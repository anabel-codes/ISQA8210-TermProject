'use client';
import { useEffect } from 'react';
export function EventTracker({
  kind,
  propertyId,
  query,
}: {
  kind: 'VIEW' | 'SEARCH' | 'FEATURED';
  propertyId?: string;
  query?: Record<string, string>;
}) {
  const signature = JSON.stringify(query ?? {});
  useEffect(() => {
    const identity = `ck:${kind}:${propertyId ?? signature}`;
    try {
      const prior = sessionStorage.getItem(identity);
      const record = prior ? JSON.parse(prior) : null;
      const key =
        record && Date.now() - record.time < 30 * 60 * 1000 ? record.key : crypto.randomUUID();
      sessionStorage.setItem(
        identity,
        JSON.stringify({ key, time: record?.key === key ? record.time : Date.now() }),
      );
      void fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, propertyId, key, query: JSON.parse(signature) }),
        keepalive: true,
      });
    } catch {
      /* Browsing remains available if storage or analytics is disabled. */
    }
  }, [kind, propertyId, signature]);
  return null;
}
