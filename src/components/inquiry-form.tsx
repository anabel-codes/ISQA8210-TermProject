'use client';
import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { inquirySchema } from '@/lib/validation';
export function InquiryForm({ propertyId }: { propertyId?: string }) {
  const [state, setState] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = {
      ...Object.fromEntries(new FormData(form)),
      ...(propertyId ? { propertyId } : {}),
    };
    const parsed = inquirySchema.safeParse(input);
    if (!parsed.success) {
      setState(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    setState('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      form.reset();
    } catch (error) {
      setState(error instanceof Error ? error.message : 'Unable to send. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return success ? (
    <div className="success" role="status">
      <CheckCircle2 />
      <h3>Thank you for reaching out.</h3>
      <p>
        Your inquiry has been saved for review. This is a demonstration site; no email notification
        is sent.
      </p>
      <button className="button secondary" onClick={() => setSuccess(false)}>
        Send another inquiry
      </button>
    </div>
  ) : (
    <form onSubmit={submit} className="form-grid">
      <label>
        Your name
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder="Full name"
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
        />
      </label>
      <label className="full">
        Phone <span className="muted">(optional)</span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={40}
          placeholder="Your phone number"
        />
      </label>
      <label className="full">
        How can we help?
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          defaultValue={propertyId ? 'I would like to learn more about this property.' : ''}
          placeholder="Tell us a little about what you’re looking for."
        />
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <p className="form-note full">
        Your details are used to respond to this inquiry and are visible only to authorized
        administrators. Please do not include sensitive financial information.
      </p>
      {state && (
        <p role="alert" className="error full">
          {state}
        </p>
      )}
      <button className="button full" disabled={busy}>
        {busy ? 'Sending…' : 'Send inquiry'}
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
