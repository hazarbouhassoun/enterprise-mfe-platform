import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

type Props = {
  title: string;
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = { hasError: boolean; error?: Error };

export class SectionErrorBoundary extends Component<Props, State> {
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
        <Card>
          <CardHeader>
            <CardTitle>{this.props.title}</CardTitle>
            <CardDescription>
              Couldn&apos;t render this block — remote or local code threw.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-foreground-muted">{this.state.error?.message}</p>
            <Button
              type="button"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Retry section
            </Button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
