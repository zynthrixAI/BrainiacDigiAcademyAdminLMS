import { AuthBrandPanel } from '@/components/widgets/AuthBrandPanel';
import { LoginForm } from '@/components/forms/LoginForm';

/**
 * Full-page composition for the admin login route. Two columns: brand panel
 * (left, hidden on small screens) and the sign-in form (right).
 */
export function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-bg lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
      <AuthBrandPanel />

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          <h2 className="m-0 mb-2 font-display text-[28px] font-extrabold tracking-[-0.01em]">
            Admin sign in
          </h2>
          <p className="m-0 text-sm leading-[1.55] text-muted">
            Use your BDA admin credentials. Teachers and students log in
            elsewhere.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
