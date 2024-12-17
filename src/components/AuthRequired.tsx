import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SignInForm } from './SignInForm';

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <SignInForm />;
  }

  return <>{children}</>;
}