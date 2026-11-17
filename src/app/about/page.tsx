import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getSettings } from '@/lib/settings';
export const metadata = { title: 'About' };
export default async function About() {
  const s = await getSettings();
  return (
    <>
      <section className="section about-page">
        <div>
          <p className="eyebrow">PEOPLE FIRST. POSSIBILITIES ALWAYS.</p>
          <h1>Meet {s.name}.</h1>
          <p className="large-copy">A personal approach to a meaningful move.</p>
          <p className="description">{s.biography}</p>
          <p className="sample-note">
            Profile, credentials, service area, and business contact information await client
            confirmation. No professional qualifications are implied by this demonstration.
          </p>
          <Link href="/contact" className="button">
            Start a conversation <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="about-page-image">
          <Image
            src="/images/home-2.jpg"
            alt="Illustrative living room with natural light and a welcoming atmosphere"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <span className="photo-note">Good spaces. New beginnings.</span>
        </div>
      </section>
      <section className="contact-banner">
        <h2>
          Your next chapter
          <br />
          is worth exploring.
        </h2>
        <Link href="/properties" className="button light">
          Browse properties <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
