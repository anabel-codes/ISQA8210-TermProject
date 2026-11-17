import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { Navigation } from '@/components/navigation';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'Carlos Kosala Real Estate | A place to call your own',
    template: '%s | Carlos Kosala Real Estate',
  },
  description:
    'Discover your next chapter. Browse clearly labeled sample properties in this ISQA 8210 academic real estate platform.',
};
export const dynamic = 'force-dynamic';
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="demo-bar">
          A UNIVERSITY OF NEBRASKA AT OMAHA TERM PROJECT <span>•</span> All sample properties are
          for demonstration.
        </div>
        <Navigation name={settings.name} />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div>
            <Link className="footer-brand" href="/">
              {settings.business}
            </Link>
            <p>Good spaces. New beginnings.</p>
            <p className="muted">
              An ISQA 8210 academic demonstration.
              <br />
              Sample listings are not actual inventory.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/properties">
              Find a property <ArrowUpRight size={14} />
            </Link>
            <Link href="/about">About {settings.name}</Link>
            <Link href="/contact">Get in touch</Link>
          </div>
          <div>
            <h3>Connect</h3>
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            {settings.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
            {!settings.email && !settings.phone && (
              <p>
                Contact details awaiting confirmation.
                <br />
                Use our inquiry form.
              </p>
            )}
            <Link href="/login">Administrator sign in</Link>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} {settings.business}
            <span>Built for learning. Designed for people.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
