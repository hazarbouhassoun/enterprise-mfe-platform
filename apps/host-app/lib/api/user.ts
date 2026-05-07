import { createLogger } from '@repo/config';
import { mockApiDelayMs } from '@/lib/api/mock-config';
import { sleep } from '@/lib/api/sleep';

const log = createLogger('host:api:user');

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  title: string;
  timezone: string;
};

export async function fetchUserProfile(
  _token: string | null,
  signal?: AbortSignal
): Promise<UserProfile> {
  // `_token` ignored until we swap mocks for a BFF — keeping the param matches the real hook shape.
  log.debug('fetchUserProfile:start');
  await sleep(mockApiDelayMs(), signal);
  return {
    id: 'usr_01',
    email: 'alex@example.com',
    name: 'Alex Rivera',
    title: 'Senior Frontend Engineer',
    timezone: 'America/Los_Angeles',
  };
}

export type AccountPreferences = {
  marketingEmails: boolean;
  weeklyDigest: boolean;
  locale: string;
};

export async function fetchAccountPreferences(
  _token: string | null,
  signal?: AbortSignal
): Promise<AccountPreferences> {
  log.debug('fetchAccountPreferences:start');
  await sleep(mockApiDelayMs(), signal);
  return { marketingEmails: true, weeklyDigest: false, locale: 'en-US' };
}

export async function updateAccountPreferences(
  _token: string | null,
  next: AccountPreferences
): Promise<AccountPreferences> {
  log.info('updateAccountPreferences', next);
  await sleep(Math.round(mockApiDelayMs() * 1.2));
  return next;
}
