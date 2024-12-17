import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from '../../../hooks/useRouter';

export function useAuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  return { user, loading };
}