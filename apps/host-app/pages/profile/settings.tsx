import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
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
import { useAuthStore } from '@/features/auth/auth-store';
import { useRequireAuth } from '@/features/auth/useRequireAuth';

const schema = z.object({
  displayName: z.string().min(2, 'Too short'),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^\+?[0-9\-()\s]{7,}$/.test(v), 'Use a plausible phone number'),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileSettingsPage() {
  const ready = useRequireAuth('/login?next=/profile/settings');
  const user = useAuthStore((s) => s.user);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      displayName: user?.name ?? '',
      phone: '+1 (555) 010-2030',
    },
  });

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
        <title>Profile settings · host-app</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Profile settings</h1>
            <p className="mt-2 text-sm text-foreground-muted">
              Signed in as <span className="font-mono text-xs">{user?.email}</span> — this form
              doesn&apos;t call an API yet; submit is a stub delay.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back</Link>
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>React Hook Form + Zod + shared UI primitives.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              onSubmit={form.handleSubmit(async () => {
                await new Promise((r) => setTimeout(r, 250));
              })}
              className="grid gap-4"
            >
              <FormField>
                <FormLabel htmlFor="displayName">Display name</FormLabel>
                <FormControl>
                  <Input id="displayName" autoComplete="name" {...form.register('displayName')} />
                </FormControl>
                <FormMessage error={Boolean(form.formState.errors.displayName)}>
                  {form.formState.errors.displayName?.message}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel htmlFor="phone">Phone</FormLabel>
                <FormControl>
                  <Input
                    id="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    {...form.register('phone')}
                  />
                </FormControl>
                <FormMessage error={Boolean(form.formState.errors.phone)}>
                  {form.formState.errors.phone?.message}
                </FormMessage>
              </FormField>

              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Save changes
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
