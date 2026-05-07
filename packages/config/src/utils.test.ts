import { describe, expect, it } from 'vitest';
import { formatDisplayDate, isNonEmptyString, safeJsonParse } from './utils';

describe('utils', () => {
  it('isNonEmptyString', () => {
    expect(isNonEmptyString('x')).toBe(true);
    expect(isNonEmptyString('  ')).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
  });

  it('safeJsonParse', () => {
    expect(safeJsonParse('not-json', { ok: true })).toEqual({ ok: true });
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
  });

  it('formatDisplayDate', () => {
    expect(formatDisplayDate('2024-01-02T12:00:00.000Z')).toMatch(/2024/);
  });
});
