import { expect, test } from '@playwright/test';

test('login then reach dashboard', async ({ page }) => {
  await page.goto('/login');
  // Account with extended permissions for demo (see docs/engineering-notes.md)
  await page.getByLabel('Email').fill('candidate+ops@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
  await expect(page.getByText('Operations metrics')).toBeVisible({ timeout: 60_000 });
});
