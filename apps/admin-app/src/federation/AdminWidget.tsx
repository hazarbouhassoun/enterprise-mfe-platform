import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { memo, useState } from 'react';

export default memo(function AdminWidget() {
  const [count, setCount] = useState(0);

  return (
    <div className="grid gap-3">
      <p className="text-sm text-foreground-muted">
        Interactive remote widget. Useful for validating shared React singletons and styling.
      </p>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick actions</CardTitle>
          <CardDescription>State is local to the federated chunk.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 pt-0">
          <Button type="button" onClick={() => setCount((c) => c + 1)}>
            Increment ({count})
          </Button>
          <Button type="button" variant="secondary" onClick={() => setCount(0)}>
            Reset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});
