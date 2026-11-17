import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/auth';
import { AdminNav } from '@/components/admin-nav';
export const metadata = { title: 'Administration', robots: { index: false, follow: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentAdmin();
  if (!user) redirect('/login');
  return (
    <div className="admin-shell">
      <AdminNav name={user.name} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
