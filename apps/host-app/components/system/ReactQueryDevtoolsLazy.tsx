import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function ReactQueryDevtoolsLazy() {
  return <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />;
}
