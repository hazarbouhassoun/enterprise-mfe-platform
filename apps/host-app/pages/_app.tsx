import { createLogger } from '@repo/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { AppErrorBoundary } from '@/components/system/AppErrorBoundary';
import { warnPublicEnvIssues } from '@/lib/env-public';
import '@/styles/globals.css';

const logger = createLogger('host:_app');

const DevTools = dynamic(
  () => import('@/components/system/ReactQueryDevtoolsLazy').then((m) => m.ReactQueryDevtoolsLazy),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
            // default in v5; explicit so nobody "optimizes" it away during refactors
            networkMode: 'online',
          },
        },
      })
  );

  useEffect(() => {
    warnPublicEnvIssues();
  }, []);

  return (
    <AppErrorBoundary
      onError={(error, info) => {
        logger.error('AppErrorBoundary', error, info);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        {process.env.NODE_ENV === 'development' ? <DevTools /> : null}
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
