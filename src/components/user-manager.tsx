'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function UserManager({
  users,
  currentId,
}: {
  users: { id: string; name: string; email: string; active: boolean }[];
  currentId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  async function request(url: string, method: string, data: unknown) {
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setError(false);
      setMessage('Account updated. Existing sessions for changed accounts are revoked.');
      router.refresh();
      return true;
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : 'Unable to update account');
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="user-list">
        {users.map((u) => (
          <div key={u.id} className="user-row">
            <div>
              <strong>{u.name}</strong>
              <p>
                {u.email} · Administrator · {u.active ? 'Active' : 'Disabled'}
                {u.id === currentId ? ' · You' : ''}
              </p>
            </div>
            <button
              className="button secondary small"
              disabled={busy || u.id === currentId}
              onClick={() => {
                if (window.confirm(`${u.active ? 'Deactivate' : 'Activate'} ${u.email}?`))
                  void request(`/api/admin/users/${u.id}`, 'PATCH', { active: !u.active });
              }}
            >
              {u.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
      {message && (
        <p role={error ? 'alert' : 'status'} className={error ? 'error' : 'notice'}>
          {message}
        </p>
      )}
      <section className="panel" style={{ marginTop: 30 }}>
        <h2>Add an administrator</h2>
        <form
          className="form-grid"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            if (await request('/api/admin/users', 'POST', Object.fromEntries(new FormData(form))))
              form.reset();
          }}
        >
          <label>
            Name
            <input name="name" required minLength={2} />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label className="full">
            Initial password
            <input
              name="password"
              type="password"
              required
              minLength={12}
              maxLength={72}
              autoComplete="new-password"
            />
          </label>
          <p className="form-note full">
            Use a unique password of at least 12 characters and share it privately. All
            administrators have full management access.
          </p>
          <button className="button" disabled={busy}>
            Create administrator
          </button>
        </form>
      </section>
      <section className="panel">
        <h2>Reset a password</h2>
        <form
          className="form-grid"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            if (
              await request(`/api/admin/users/${data.get('id')}`, 'PATCH', {
                password: data.get('password'),
              })
            )
              form.reset();
          }}
        >
          <label>
            Account
            <select name="id">
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
          </label>
          <label>
            New password
            <input
              name="password"
              type="password"
              required
              minLength={12}
              maxLength={72}
              autoComplete="new-password"
            />
          </label>
          <button className="button" disabled={busy}>
            Reset password
          </button>
          <p className="form-note">Resetting your own password requires signing in again.</p>
        </form>
      </section>
    </>
  );
}
