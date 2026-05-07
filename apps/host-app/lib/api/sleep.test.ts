import { describe, expect, it } from 'vitest';
import { sleep } from './sleep';

describe('sleep', () => {
  it('rejects when already aborted', async () => {
    const ac = new AbortController();
    ac.abort();
    await expect(sleep(50, ac.signal)).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('rejects when aborted during wait', async () => {
    const ac = new AbortController();
    const p = sleep(5000, ac.signal);
    setTimeout(() => ac.abort(), 0);
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });
});
