'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
export function Navigation({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-symbol">
          CK<span>⌂</span>
        </span>
        <span>
          {name}
          <small>REAL ESTATE</small>
        </span>
      </Link>
      <button
        className="mobile-toggle"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav aria-label="Main navigation" className={open ? 'open' : ''}>
        {[
          ['/', 'Home'],
          ['/properties', 'Properties'],
          ['/about', 'About'],
          ['/contact', 'Contact'],
        ].map(([href, text]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={pathname === href ? 'page' : undefined}
          >
            {text}
          </Link>
        ))}
        <Link className="button small" href="/contact" onClick={() => setOpen(false)}>
          Let’s talk <ArrowUpRight size={16} />
        </Link>
      </nav>
    </header>
  );
}
