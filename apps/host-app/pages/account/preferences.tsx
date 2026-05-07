import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  Input,
} from '@repo/ui';
import type { AccountPreferences } from '@/lib/api/user';
import { useAccountPreferences } from '@/features/account/hooks/useAccountPreferences';
import { useRequireAuth } from '@/features/auth/useRequireAuth';

const schema = z.object({
  marketingEmails: z.boolean(),
  weeklyDigest: z.boolean(),
  locale: z.enum(['en-US', 'en-GB', 'es-ES']),
});

type FormValues = z.infer<typeof schema>;

function PreferencesForm({
  initial,
  save,
  isSaving,
}: {
  initial: AccountPreferences;
  save: (next: AccountPreferences) => Promise<unknown>;
  isSaving: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      marketingEmails: initial.marketingEmails,
      weeklyDigest: initial.weeklyDigest,
      locale: initial.locale as FormValues['locale'],
    },
  });

  const [saveAck, setSaveAck] = useState(false);
  const saveAckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (saveAckTimerRef.current) clearTimeout(saveAckTimerRef.current);
    },
    []
  );

  return (
    <Form
      className="grid gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        setSaveAck(false);
        if (saveAckTimerRef.current) {
          clearTimeout(saveAckTimerRef.current);
          saveAckTimerRef.current = null;
        }
        await save(values);
        setSaveAck(true);
        saveAckTimerRef.current = setTimeout(() => {
          setSaveAck(false);
          saveAckTimerRef.current = null;
        }, 5_000);
      })}
    >
      <FormField className="flex items-start gap-3">
        <FormControl>
          <Controller
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <Input
                id="marketingEmails"
                type="checkbox"
                className="mt-1 h-4 w-4"
                disabled={isSaving}
                checked={field.value}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </FormControl>
        <div className="grid gap-1">
          <FormLabel htmlFor="marketingEmails">Product updates</FormLabel>
          <p className="text-sm text-foreground-muted">
            Occasional emails about new capabilities and best practices.
          </p>
        </div>
      </FormField>

      <FormField className="flex items-start gap-3">
        <FormControl>
          <Controller
            control={form.control}
            name="weeklyDigest"
            render={({ field }) => (
              <Input
                id="weeklyDigest"
                type="checkbox"
                className="mt-1 h-4 w-4"
                disabled={isSaving}
                checked={field.value}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </FormControl>
        <div className="grid gap-1">
          <FormLabel htmlFor="weeklyDigest">Weekly digest</FormLabel>
          <p className="text-sm text-foreground-muted">
            A summary of activity across your workspace.
          </p>
        </div>
      </FormField>

      <FormField>
        <FormLabel htmlFor="locale">Locale</FormLabel>
        <FormControl>
          <select
            id="locale"
            disabled={isSaving}
            className="h-10 w-full max-w-sm rounded-md border border-foreground/15 bg-surface px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            {...form.register('locale')}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish (Spain)</option>
          </select>
        </FormControl>
        <FormMessage error={Boolean(form.formState.errors.locale)}>
          {form.formState.errors.locale?.message}
        </FormMessage>
      </FormField>

      <div className="flex flex-col items-end gap-2">
        <Button type="submit" disabled={isSaving} aria-busy={isSaving}>
          {isSaving ? 'Saving…' : 'Save preferences'}
        </Button>
        {saveAck ? (
          <p
            className="max-w-md text-right text-xs text-foreground-muted"
            role="status"
            aria-live="polite"
          >
            Preferences saved.
          </p>
        ) : null}
      </div>
    </Form>
  );
}

export default function AccountPreferencesPage() {
  const ready = useRequireAuth('/login?next=/account/preferences');
  const prefs = useAccountPreferences();

  if (!ready) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-8">
        <p className="text-sm text-foreground-muted">Checking session…</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Account preferences · host-app</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Account preferences</h1>
            <p className="mt-2 text-sm text-foreground-muted">
              Server-state via TanStack Query with a mutation that simulates persistence.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back</Link>
          </Button>
        </header>

        <Card aria-busy={prefs.isLoading || prefs.isFetching || prefs.isSaving}>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Native controls for predictable accessibility behavior.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prefs.isLoading ? (
              <p className="text-sm text-foreground-muted">Loading preferences…</p>
            ) : null}
            {!prefs.isLoading && prefs.isFetching && prefs.data ? (
              <p className="text-xs text-foreground-muted" role="status">
                Syncing latest…
              </p>
            ) : null}
            {prefs.isError ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-red-600">Couldn&apos;t load preferences.</p>
                <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => void prefs.refetch()}>
                  Retry
                </Button>
              </div>
            ) : null}
            {!prefs.isLoading && !prefs.isError && !prefs.data ? (
              <p className="text-sm text-foreground-muted">Nothing to show yet.</p>
            ) : null}
            {prefs.data ? (
              <PreferencesForm
                key={`${prefs.data.marketingEmails}-${prefs.data.weeklyDigest}-${prefs.data.locale}`}
                initial={prefs.data}
                save={prefs.save}
                isSaving={prefs.isSaving}
              />
            ) : null}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
