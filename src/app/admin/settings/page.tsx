import { requireAdminPage } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { SettingsForm } from '@/components/settings-form';
export default async function Settings() {
  await requireAdminPage();
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>A personal touch.</h1>
          <p>Configure verified contact information and homepage content.</p>
        </div>
      </div>
      <SettingsForm settings={await getSettings()} />
    </>
  );
}
