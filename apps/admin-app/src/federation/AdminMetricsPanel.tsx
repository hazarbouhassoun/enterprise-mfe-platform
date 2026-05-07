import { createLogger } from '@repo/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';
import { memo } from 'react';

const log = createLogger('admin:AdminMetricsPanel');

const MOCK_ROWS = [
  { id: '1', area: 'Checkout', p95: '412ms', errors: '0.02%' },
  { id: '2', area: 'Search', p95: '228ms', errors: '0.08%' },
  { id: '3', area: 'Admin', p95: '512ms', errors: '0.11%' },
];

export default memo(function AdminMetricsPanel() {
  log.debug('render');

  return (
    <div className="grid gap-3">
      <p className="text-sm text-foreground-muted">
        This panel ships from <span className="font-mono text-xs">admin-app</span> and uses shared
        UI primitives from <span className="font-mono text-xs">@repo/ui</span>.
      </p>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">SLO snapshot</CardTitle>
          <CardDescription>Mock operational metrics for demo purposes.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Table caption="Latency and error budgets by product area.">
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>p95</TableHead>
                <TableHead>Error rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ROWS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.area}</TableCell>
                  <TableCell>{r.p95}</TableCell>
                  <TableCell>{r.errors}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
});
