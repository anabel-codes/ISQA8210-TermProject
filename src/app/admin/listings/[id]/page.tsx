import { notFound } from 'next/navigation';
import { requireAdminPage } from '@/lib/auth';
import { db } from '@/lib/db';
import { imageInclude } from '@/lib/properties';
import { PropertyEditor } from '@/components/property-editor';
export default async function Edit({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const p = await db.property.findUnique({
    where: { id: (await params).id },
    include: imageInclude,
  });
  if (!p) notFound();
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Edit property</h1>
          <p>{p.title}</p>
        </div>
      </div>
      <PropertyEditor
        key={p.id}
        property={{
          ...p,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        }}
      />
    </>
  );
}
