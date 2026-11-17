'use client';
import { useState } from 'react';
import type { defaultSettings } from '@/lib/settings';
export function SettingsForm({ settings }: { settings: typeof defaultSettings }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  return (
    <form
      className="form-grid settings-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setBusy(true);
        setMessage('');
        try {
          const res = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const body = await res.json();
          if (!res.ok) throw new Error(body.error);
          setError(false);
          setMessage('Settings saved. Refresh a public page to see your changes.');
        } catch (e) {
          setError(true);
          setMessage(e instanceof Error ? e.message : 'Unable to save settings');
        } finally {
          setBusy(false);
        }
      }}
    >
      {[
        ['name', 'Realtor name'],
        ['business', 'Business display name'],
        ['email', 'Contact email (optional)'],
        ['phone', 'Contact phone (optional)'],
        ['heroTitle', 'Homepage headline'],
        ['heroSubtitle', 'Homepage introduction'],
      ].map(([name, text]) => (
        <label key={name}>
          {text}
          <input
            name={name}
            type={name === 'email' ? 'email' : 'text'}
            required={!['email', 'phone'].includes(name)}
            defaultValue={settings[name as keyof typeof settings]}
          />
        </label>
      ))}
      <label className="full">
        Realtor biography
        <textarea name="biography" rows={6} maxLength={4000} defaultValue={settings.biography} />
      </label>
      <p className="form-note full">
        Only enter verified business information. Blank contact fields show “awaiting confirmation”
        in the public site. Branding colors and the CK monogram are maintained in source CSS and
        navigation.
      </p>
      {message && (
        <p role={error ? 'alert' : 'status'} className={`${error ? 'error' : 'notice'} full`}>
          {message}
        </p>
      )}
      <button className="button" disabled={busy}>
        {busy ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}
