import { checkLogs, seniorUser } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Pill, Phone, Siren, Calendar } from 'lucide-react';

const activityIcons = {
  medication: <Pill className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  schedule_view: <Calendar className="h-4 w-4" />,
  sos: <Siren className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  missed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  delayed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export function CheckLog() {
  const sortedLogs = [...checkLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activity Check-Log</CardTitle>
        <CardDescription>Recent activities from {seniorUser.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {activityIcons[log.activityType]}
                    <span className="font-medium capitalize">{log.activityType.replace('_', ' ')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${statusColors[log.status]}`}
                  >
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(log.timestamp, "MMM d, p")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
