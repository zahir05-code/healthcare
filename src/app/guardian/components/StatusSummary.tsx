import { seniorUser, checkLogs } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
        <CardTitle className="text-2xl font-bold">Today's Status: {seniorUser.name}</CardTitle>
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
              <p className="text-sm text-muted-foreground">Overall</p>
              <p className="text-lg font-semibold">{sosToday ? 'Attention Needed' : 'All Good'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Morning Meds</p>
              <Badge variant={morningMedsTaken ? 'default' : 'destructive'} className={morningMedsTaken ? 'bg-green-500' : ''}>
                {morningMedsTaken ? 'Taken' : 'Pending'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Last Activity</p>
              <p className="text-lg font-semibold">
                {formatDistanceToNow(lastActivity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <AlertTriangle className={`h-8 w-8 ${sosToday ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-sm text-muted-foreground">SOS Today</p>
               <Badge variant={sosToday ? 'destructive' : 'secondary'}>
                {sosToday ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
