'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        const data = new FormData(e.currentTarget);
        try {
          const result = await signIn('credentials', {
            email: data.get('email'),
            password: data.get('password'),
            redirect: false,
          });
          if (result?.error)
            setError('Unable to sign in. Check your credentials or try again later.');
          else {
            router.push('/admin');
            router.refresh();
          }
        } catch {
          setError('Unable to sign in. Please try again.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Email address
        <input name="email" type="email" required autoComplete="username" maxLength={254} />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          maxLength={72}
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button className="button" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="form-note">
        Administrator accounts are provisioned by the project owner. Public visitors do not need an
        account.
      </p>
    </form>
  );
}
