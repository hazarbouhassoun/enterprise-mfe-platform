import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/auth-store';
import {
  fetchAccountPreferences,
  updateAccountPreferences,
  type AccountPreferences,
} from '@/lib/api/user';
import { trackClientEvent } from '@/lib/telemetry';

export function useAccountPreferences() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['account-preferences', token],
    queryFn: ({ signal }) => fetchAccountPreferences(token, signal),
    enabled: Boolean(token),
    staleTime: 60_000,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: (next: AccountPreferences) => updateAccountPreferences(token, next),
    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: ['account-preferences', token] });
      const previous = qc.getQueryData<AccountPreferences>(['account-preferences', token]);
      qc.setQueryData(['account-preferences', token], next);
      return { previous } as { previous?: AccountPreferences };
    },
    onError: (_err, _next, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(['account-preferences', token], context.previous);
      } else {
        void qc.invalidateQueries({ queryKey: ['account-preferences', token] });
      }
    },
    onSuccess: (data) => {
      qc.setQueryData(['account-preferences', token], data);
      trackClientEvent('account_preferences_saved', { locale: data.locale });
    },
  });

  return { ...query, save: mutation.mutateAsync, isSaving: mutation.isPending };
}
