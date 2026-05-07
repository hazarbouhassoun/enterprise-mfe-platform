import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/auth-store';
import { fetchUserProfile } from '@/lib/api/user';

export function useUserProfileQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['user-profile', token],
    queryFn: ({ signal }) => fetchUserProfile(token, signal),
    enabled: Boolean(token),
    staleTime: 60_000,
    retry: 1,
  });
}
