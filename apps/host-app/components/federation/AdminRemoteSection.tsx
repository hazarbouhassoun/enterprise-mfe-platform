import { createLogger } from '@repo/config';
import { lazy, memo, Suspense, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { SectionErrorBoundary } from '@/components/system/SectionErrorBoundary';

const log = createLogger('host:federation');

const AdminMetricsPanel = lazy(() => import('admin/admin-metrics'));
const AdminWidget = lazy(() => import('admin/admin-widget'));

function FederationFallback() {
  return (
    <div
      className="space-y-2 rounded-md border border-dashed border-foreground/20 p-4"
      role="status"
      aria-live="polite"
    >
      <div className="h-3 w-2/3 max-w-[14rem] animate-pulse rounded bg-foreground/10" />
      <div className="h-3 w-1/2 max-w-[10rem] animate-pulse rounded bg-foreground/10" />
      <p className="pt-1 text-sm text-foreground-muted">Pulling remote chunk from admin-app…</p>
    </div>
  );
}

export const AdminRemoteSection = memo(function AdminRemoteSection() {
  const onError = useMemo(
    () => (error: Error) => {
      log.error('Federation section error', error);
    },
    []
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionErrorBoundary title="Admin metrics (remote)" onError={onError}>
        <Card>
          <CardHeader>
            <CardTitle>Operations metrics</CardTitle>
            <CardDescription>
              Loaded from <code className="font-mono text-xs">admin-app</code> via Module
              Federation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<FederationFallback />}>
              <AdminMetricsPanel />
            </Suspense>
          </CardContent>
        </Card>
      </SectionErrorBoundary>

      <SectionErrorBoundary title="Admin widget (remote)" onError={onError}>
        <Card>
          <CardHeader>
            <CardTitle>Admin quick actions</CardTitle>
            <CardDescription>
              Second remote entry to demonstrate multiple exposed modules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<FederationFallback />}>
              <AdminWidget />
            </Suspense>
          </CardContent>
        </Card>
      </SectionErrorBoundary>
    </div>
  );
});
