import { requireAdminPage } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserManager } from '@/components/user-manager';
export default async function Users() {
  const user = await requireAdminPage();
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, active: true },
    orderBy: { createdAt: 'asc' },
  });
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Your trusted team.</h1>
          <p>Provision, disable, or reset administrator accounts.</p>
        </div>
      </div>
      <UserManager users={users} currentId={user.id} />
    </>
  );
}
