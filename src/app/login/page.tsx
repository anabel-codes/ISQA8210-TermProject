import { currentAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
export const metadata = { title: 'Administrator sign in' };
export default async function Login() {
  if (await currentAdmin()) redirect('/admin');
  return (
    <section className="login-section">
      <div className="login-box">
        <p className="eyebrow">CARLOS KOSALA REAL ESTATE</p>
        <h1>Welcome back.</h1>
        <p>Sign in to manage listings, inquiries, and site content.</p>
        <LoginForm />
      </div>
    </section>
  );
}
