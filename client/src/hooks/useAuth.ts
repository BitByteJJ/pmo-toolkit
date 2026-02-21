import { trpc } from '@/lib/trpc';

export function useAuth() {
  const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: user ?? null,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
