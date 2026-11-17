import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MapPin, Compass, HeartHandshake, KeyRound, MoveRight } from 'lucide-react';
import { db } from '@/lib/db';
import { imageInclude } from '@/lib/properties';
import { getSettings } from '@/lib/settings';
import { PropertyCard } from '@/components/property-card';
import { SearchForm } from '@/components/search-form';
export default async function Home() {
  const [settings, featured] = await Promise.all([
    getSettings(),
    db.property.findMany({
      where: { published: true, featured: true },
      include: imageInclude,
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> YOUR NEXT CHAPTER STARTS HERE
          </p>
          <h1>{settings.heroTitle}</h1>
          <p className="hero-description">{settings.heroSubtitle}</p>
          <div className="hero-foot">
            <span className="circle-icon">
              <Compass size={20} />
            </span>
            <p>
              Thoughtful spaces.
              <br />
              <strong>Possibilities worth exploring.</strong>
            </p>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/images/home-1.jpg"
            alt="Contemporary home with warm lighting, landscaping, and an outdoor terrace; illustrative stock photograph"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 60vw"
          />
          <div className="hero-image-label">
            <MapPin size={15} /> Discover a different kind of home search
          </div>
          <span className="vertical-caption">MAKE ROOM FOR WHAT’S NEXT</span>
        </div>
        <div className="hero-search-wrap">
          <SearchForm compact />
        </div>
      </section>
      <section className="intro-strip">
        <p>
          A home is more than an address.
          <br />
          <strong>It’s where your life happens.</strong>
        </p>
        <span>
          Explore with confidence, from the first search
          <br />
          to the first conversation.
        </span>
        <Link href="/about" className="text-link">
          Get to know Carlos <ArrowUpRight size={17} />
        </Link>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SPACES WITH POSSIBILITY</p>
            <h2>A few places to fall for.</h2>
          </div>
          <Link href="/properties" className="button secondary">
            Explore all properties <ArrowUpRight size={18} />
          </Link>
        </div>
        <p className="sample-note">
          An imagined collection for this academic project. All listings below are sample data;
          photographs are illustrative.
        </p>
        {featured.length ? (
          <div className="property-grid">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} featured />
            ))}
          </div>
        ) : (
          <div className="empty">
            No featured properties yet. Explore the catalog or check back soon.
          </div>
        )}
      </section>
      <section className="about-home">
        <div className="about-photo">
          <Image
            src="/images/home-2.jpg"
            alt="Illustrative home interior with a welcoming living space"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
          />
          <span className="photo-note">A little inspiration for what comes next.</span>
        </div>
        <div className="about-home-copy">
          <p className="eyebrow">A PERSONAL APPROACH</p>
          <h2>
            Your search.
            <br />
            Your story.
            <br />
            <em>Your next home.</em>
          </h2>
          <p>
            Real estate begins with understanding what matters to you. Explore the possibilities
            with {settings.name} and take the next step at your own pace.
          </p>
          <Link className="text-link" href="/about">
            Meet {settings.name} <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="center-heading">
          <p className="eyebrow">FROM POSSIBILITY TO A PLAN</p>
          <h2>A clearer path forward.</h2>
        </div>
        <div className="steps">
          {[
            [
              Compass,
              '01',
              'Explore your options',
              'Search by the details that matter, from location and price to space and style.',
            ],
            [
              HeartHandshake,
              '02',
              'Start a conversation',
              'Ask about a property or share what you have in mind. We’ll keep your inquiry in one place.',
            ],
            [
              KeyRound,
              '03',
              'Imagine your next chapter',
              'Take your time, compare the possibilities, and find a place that feels right.',
            ],
          ].map(([Icon, n, title, text]) => {
            const I = Icon as typeof Compass;
            return (
              <div key={String(n)}>
                <div className="step-top">
                  <I size={27} />
                  <span>{String(n)}</span>
                </div>
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="contact-banner">
        <div>
          <p className="eyebrow">LET’S TALK ABOUT WHAT’S NEXT</p>
          <h2>
            Every new beginning
            <br />
            starts with a conversation.
          </h2>
        </div>
        <Link href="/contact" className="button light">
          Get in touch <MoveRight size={20} />
        </Link>
      </section>
    </>
  );
}
