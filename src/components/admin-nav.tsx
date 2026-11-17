'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  House,
  Inbox,
  ChartNoAxesCombined,
  Settings,
  Users,
  LogOut,
} from 'lucide-react';
const links = [
  { href: '/admin', text: 'Overview', Icon: LayoutDashboard },
  { href: '/admin/listings', text: 'Listings', Icon: House },
  { href: '/admin/inquiries', text: 'Inquiries', Icon: Inbox },
  { href: '/admin/analytics', text: 'Analytics', Icon: ChartNoAxesCombined },
  { href: '/admin/settings', text: 'Site settings', Icon: Settings },
  { href: '/admin/users', text: 'Users', Icon: Users },
];
export function AdminNav({ name }: { name: string }) {
  const path = usePathname();
  return (
    <aside className="admin-sidebar">
      <p>ADMINISTRATION · {name}</p>
      <nav aria-label="Administration">
        {links.map(({ href, text, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={
              (href === '/admin' ? path === href : path.startsWith(href)) ? 'page' : undefined
            }
          >
            <Icon size={17} />
            {text}
          </Link>
        ))}
      </nav>
      <button className="button secondary small" onClick={() => signOut({ callbackUrl: '/login' })}>
        <LogOut size={15} /> Sign out
      </button>
    </aside>
  );
}
