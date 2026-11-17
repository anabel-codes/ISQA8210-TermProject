'use client';
import Image from 'next/image';
import { useState } from 'react';
export function Gallery({ images }: { images: { id: string; url: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return <div className="empty">Photographs will be available soon.</div>;
  return (
    <div className="gallery">
      <div className="gallery-main">
        <Image
          src={images[index].url}
          alt={images[index].alt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 75vw"
        />
        <span className="badge gallery-count">
          {index + 1} / {images.length}
        </span>
      </div>
      {images.length > 1 && (
        <div className="thumbnails">
          {images.map((image, i) => (
            <button
              key={image.id}
              className={i === index ? 'selected' : ''}
              onClick={() => setIndex(i)}
              aria-label={`View photograph ${i + 1}: ${image.alt}`}
              aria-pressed={i === index}
            >
              <Image src={image.url} alt={image.alt} width={140} height={90} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
