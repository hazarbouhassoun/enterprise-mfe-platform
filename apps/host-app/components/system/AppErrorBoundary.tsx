import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

type Props = {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = { hasError: boolean; error?: Error };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
          <Card>
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                The shell hit an uncaught render error. Copy the message below if you&apos;re filing
                a bug.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-foreground-muted">
                {this.state.error?.message ?? 'Unknown error'}
              </p>
              <Button
                type="button"
                onClick={() => this.setState({ hasError: false, error: undefined })}
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        </main>
      );
    }
    return this.props.children;
  }
}
