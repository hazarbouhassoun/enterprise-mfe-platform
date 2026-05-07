import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

export default function AdminHomePage() {
  return (
    <>
      <Head>
        <title>admin-app · remote</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-10">
        <header>
          <p className="text-sm font-medium text-foreground-muted">Module Federation remote</p>
          <h1 className="text-2xl font-semibold tracking-tight">admin-app</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            This Next.js app is independently deployable. The host consumes exposed modules from{' '}
            <code className="font-mono text-xs">/_next/static/.../remoteEntry.js</code>.
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Local development</CardTitle>
            <CardDescription>Run on port 3001 alongside host-app (3000).</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-foreground-muted">
            Exposed modules: <span className="font-mono">admin-metrics</span>,{' '}
            <span className="font-mono">admin-widget</span>.
          </CardContent>
        </Card>
      </main>
    </>
  );
}
