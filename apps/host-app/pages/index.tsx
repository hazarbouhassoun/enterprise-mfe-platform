import Head from 'next/head';
import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Host shell · Enterprise MFE demo</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 p-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground-muted">
            Turborepo · Next.js 15 · Module Federation
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Customer shell (host-app)</h1>
          <p className="max-w-2xl text-foreground-muted">
            Auth + customer flows live here; admin capabilities are pulled from a separate deploy
            when the account has access.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Authentication demo</CardTitle>
              <CardDescription>Zustand + persisted mock token + protected areas.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/login">Go to login</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Self-service</CardTitle>
              <CardDescription>React Hook Form + Zod + TanStack Query.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/profile/settings">Profile settings</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/account/preferences">Account preferences</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
