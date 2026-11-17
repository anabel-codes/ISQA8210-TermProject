import { requireAdminPage } from '@/lib/auth';
import { PropertyEditor } from '@/components/property-editor';
export default async function NewListing() {
  await requireAdminPage();
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>A new possibility.</h1>
          <p>Create a draft or publish a complete listing.</p>
        </div>
      </div>
      <PropertyEditor />
    </>
  );
}
