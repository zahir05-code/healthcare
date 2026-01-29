import { seniorUser, checkLogs } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function StatusSummary() {
  const lastActivity = checkLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  const morningMedsTaken = checkLogs.some(
    log =>
      log.activityType === 'medication' &&
      new Date(log.timestamp).toDateString() === new Date().toDateString() &&
      new Date(log.timestamp).getHours() < 12
  );
  const sosToday = checkLogs.some(
    log =>
      log.activityType === 'sos' &&
      new Date(log.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">오늘의 상태: {seniorUser.name}</CardTitle>
        <Avatar>
          <AvatarImage src={seniorUser.avatarUrl} alt={seniorUser.name} data-ai-hint="person portrait" />
          <AvatarFallback>{seniorUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center space-x-4">
            <HeartPulse className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">전반적 상태</p>
              <p className="text-lg font-semibold">{sosToday ? '주의 필요' : '양호'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">오전 약</p>
              <Badge variant={morningMedsTaken ? 'default' : 'destructive'} className={morningMedsTaken ? 'bg-green-500' : ''}>
                {morningMedsTaken ? '복용 완료' : '대기 중'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">마지막 활동</p>
              <p className="text-lg font-semibold">
                {formatDistanceToNow(lastActivity.timestamp, { addSuffix: true, locale: ko })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <AlertTriangle className={`h-8 w-8 ${sosToday ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-sm text-muted-foreground">오늘의 긴급 호출</p>
               <Badge variant={sosToday ? 'destructive' : 'secondary'}>
                {sosToday ? '예' : '아니요'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
