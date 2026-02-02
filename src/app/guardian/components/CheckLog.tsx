import { checkLogs, seniorUser } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Pill, Phone, Siren, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const activityIcons = {
  medication: <Pill className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  schedule_view: <Calendar className="h-4 w-4" />,
  sos: <Siren className="h-4 w-4 text-destructive" />,
};

const activityNames = {
    medication: '복약',
    call: '전화',
    schedule_view: '일정 조회',
    sos: '긴급 호출',
};

const statusNames = {
    completed: '완료',
    missed: '놓침',
    delayed: '지연',
}

export function CheckLog() {
  const sortedLogs = [...checkLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>활동 확인 로그</CardTitle>
        <CardDescription>{seniorUser.name}님의 최근 활동입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>활동</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">시간</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {activityIcons[log.activityType]}
                    <span className="font-medium capitalize">{activityNames[log.activityType]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn('capitalize border-none', {
                      'bg-primary/20 text-primary': log.status === 'completed',
                      'bg-destructive/20 text-destructive': log.status === 'missed',
                      'bg-accent/20 text-accent': log.status === 'delayed',
                    })}
                  >
                    {statusNames[log.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(log.timestamp, "MMM d, p", { locale: ko })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
