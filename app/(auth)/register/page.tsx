import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account — Neuro Stock',
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Create an account</h2>
        <p className="text-gray-500 text-sm mt-1">Join Neuro Stock to get started</p>
      </div>
      <RegisterForm />
    </>
  );
}
