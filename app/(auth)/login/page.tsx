import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Neuro Stock',
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
        <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
      </div>
      <LoginForm />
    </>
  );
}
