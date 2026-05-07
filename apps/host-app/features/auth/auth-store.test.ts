import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './auth-store';

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null, scopes: [] });
  });

  it('logs in and out', async () => {
    const hook = renderHook(() => useAuthStore((s) => s));

    await act(async () => {
      await hook.result.current.login('a@b.com', 'pw');
    });

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBeTruthy();
    });

    act(() => {
      useAuthStore.getState().logout();
    });

    expect(useAuthStore.getState().token).toBeNull();
  });

  it('assigns admin federation scope for +ops emails', async () => {
    const hook = renderHook(() => useAuthStore((s) => s));
    await act(async () => {
      await hook.result.current.login('ops-demo+ops@example.com', 'pw');
    });
    await waitFor(() => {
      expect(useAuthStore.getState().scopes).toContain('admin.widgets.read');
    });
  });
});
