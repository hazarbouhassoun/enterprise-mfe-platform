import { zodResolver } from '@hookform/resolvers/zod';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/compat/router';
import { useEffect, useRef, useState } from 'react';
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
  Textarea,
} from '@repo/ui';
import { useUserProfileQuery } from '@/features/account/hooks/useUserProfileQuery';
import { useAuthStore } from '@/features/auth/auth-store';
import { canEmbedAdminRemote } from '@/features/auth/scopes';
import { routerReplace } from '@/features/auth/client-navigation';
import { useRequireAuth } from '@/features/auth/useRequireAuth';

// MF remotes expect browser APIs + separate deploy origin; keeping this client-only avoids SSR
// trying to resolve admin chunks from the wrong host.
const AdminRemoteSection = dynamic(
  () => import('@/components/federation/AdminRemoteSection').then((m) => m.AdminRemoteSection),
  {
    ssr: false,
    loading: () => <p className="text-sm text-foreground-muted">Preparing remote modules…</p>,
  }
);

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  title: z.string().min(2, 'Title is too short'),
  bio: z.string().max(280, 'Bio is too long').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

type Props = { serverTime: string };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return { props: { serverTime: new Date().toISOString() } };
};

export default function DashboardPage({ serverTime }: Props) {
  const ready = useRequireAuth('/login');
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const scopes = useAuthStore((s) => s.scopes);
  const profile = useUserProfileQuery();
  const showAdminRemotes = canEmbedAdminRemote(scopes);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: user?.name ?? '',
      title: profile.data?.title ?? 'Senior Frontend Engineer',
      bio: 'I like resilient UI platforms and measurable UX.',
    },
  });

  const [profileSaveAck, setProfileSaveAck] = useState(false);
  const profileSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (profileSaveTimerRef.current) clearTimeout(profileSaveTimerRef.current);
    },
    []
  );

  if (!ready) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-8">
        <p className="text-sm text-foreground-muted">Checking session…</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard · host-app</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 p-8">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-foreground-muted">Protected route · SSR props</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-foreground-muted">
              Shell route rendered on the server at{' '}
              <span className="font-mono text-xs">{serverTime}</span>. Federated widgets hydrate on
              the client.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/profile/settings">Profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Home</Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                void routerReplace(router, '/login');
              }}
            >
              Sign out
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <CardDescription>
              Mock bearer token (truncated) stored via Zustand persist.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="break-all font-mono text-xs text-foreground-muted">
              {token ? `${token.slice(0, 18)}…` : 'No token'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shell data (TanStack Query)</CardTitle>
            <CardDescription>Mock API layer + query caching + loading states.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {profile.isLoading ? <p className="text-foreground-muted">Loading profile…</p> : null}
            {!profile.isLoading && profile.isFetching && profile.data ? (
              <p className="text-xs text-foreground-muted" role="status">
                Refreshing…
              </p>
            ) : null}
            {profile.isError ? (
              <div className="flex flex-col gap-2">
                <p className="text-red-600">Couldn&apos;t load profile (mock API).</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => void profile.refetch()}
                >
                  Try again
                </Button>
              </div>
            ) : null}
            {profile.data ? (
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-foreground-muted">Email</dt>
                  <dd className="font-medium">{profile.data.email}</dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">Title</dt>
                  <dd className="font-medium">{profile.data.title}</dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">Timezone</dt>
                  <dd className="font-medium">{profile.data.timezone}</dd>
                </div>
              </dl>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile snapshot (client form)</CardTitle>
            <CardDescription>
              Demonstrates RHF + Zod validation alongside shell-owned session state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              onSubmit={form.handleSubmit(async () => {
                setProfileSaveAck(false);
                if (profileSaveTimerRef.current) {
                  clearTimeout(profileSaveTimerRef.current);
                  profileSaveTimerRef.current = null;
                }
                // long enough to read the button state; still mock-only
                await new Promise((r) => setTimeout(r, 520));
                setProfileSaveAck(true);
                profileSaveTimerRef.current = setTimeout(() => {
                  setProfileSaveAck(false);
                  profileSaveTimerRef.current = null;
                }, 5_000);
              })}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField>
                  <FormLabel htmlFor="name">Display name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      disabled={form.formState.isSubmitting}
                      {...form.register('name')}
                    />
                  </FormControl>
                  <FormMessage error={Boolean(form.formState.errors.name)}>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      disabled={form.formState.isSubmitting}
                      {...form.register('title')}
                    />
                  </FormControl>
                  <FormMessage error={Boolean(form.formState.errors.title)}>
                    {form.formState.errors.title?.message}
                  </FormMessage>
                </FormField>
              </div>
              <FormField className="mt-4">
                <FormLabel htmlFor="bio">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    id="bio"
                    rows={4}
                    disabled={form.formState.isSubmitting}
                    {...form.register('bio')}
                  />
                </FormControl>
                <FormMessage error={Boolean(form.formState.errors.bio)}>
                  {form.formState.errors.bio?.message}
                </FormMessage>
              </FormField>
              <div className="mt-4 flex flex-col items-end gap-2">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  aria-busy={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Saving…' : 'Save (demo)'}
                </Button>
                {profileSaveAck ? (
                  <p
                    className="max-w-md text-right text-xs text-foreground-muted"
                    role="status"
                    aria-live="polite"
                  >
                    Saved. (demo — not persisted)
                  </p>
                ) : null}
              </div>
            </Form>
          </CardContent>
        </Card>

        {showAdminRemotes ? (
          <AdminRemoteSection />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="mb-2">Admin capabilities</CardTitle>
              <CardDescription>
                Admin features are available for authorized accounts only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-foreground-muted">
              <p>To access advanced admin capabilities, sign in with an approved account.</p>
              <p>Example demo accounts may include extended permissions.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
