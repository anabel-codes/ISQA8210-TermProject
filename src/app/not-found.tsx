import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="empty section">
      <p className="eyebrow">A DIFFERENT DIRECTION</p>
      <h1>This page isn’t available.</h1>
      <p>The property may have been unpublished or the link may have changed.</p>
      <Link className="button" href="/properties">
        Explore properties
      </Link>
    </div>
  );
}
