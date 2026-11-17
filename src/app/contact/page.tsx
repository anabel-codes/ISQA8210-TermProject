import { InquiryForm } from '@/components/inquiry-form';
import { getSettings } from '@/lib/settings';
export const metadata = { title: 'Contact' };
export default async function Contact() {
  const s = await getSettings();
  return (
    <section className="section contact-page">
      <div>
        <p className="eyebrow">OPEN THE DOOR TO WHAT’S NEXT</p>
        <h1>
          Good things start
          <br />
          with hello.
        </h1>
        <p className="large-copy">Tell us what you have in mind.</p>
        <p>
          Whether you’re exploring a property or just beginning your search, leave a message for{' '}
          {s.name}.
        </p>
        <div className="contact-details">
          {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
          {s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}
          {!s.email && !s.phone && (
            <p>
              Direct contact details are awaiting confirmation.
              <br />
              This form securely saves inquiries to the dashboard.
            </p>
          )}
        </div>
        <p className="sample-note">
          Academic demonstration: inquiries are stored for review, but no email delivery or response
          time is promised.
        </p>
      </div>
      <div className="contact-form-box">
        <h2>Let’s start a conversation.</h2>
        <InquiryForm />
      </div>
    </section>
  );
}
