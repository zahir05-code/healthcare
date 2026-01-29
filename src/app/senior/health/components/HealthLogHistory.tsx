import { healthLogs } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Droplets, HeartPulse } from 'lucide-react';

export function HealthLogHistory() {
    const sortedLogs = [...healthLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return (
        <Card className="h-[520px]">
            <CardHeader>
                <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[420px]">
                    <div className="space-y-4">
                        {sortedLogs.map((log) => (
                            <div key={log.id} className="p-4 rounded-lg border">
                                <p className="font-semibold text-sm mb-2">{format(log.timestamp, "PPP p")}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <HeartPulse className="h-4 w-4 text-red-500" />
                                        <span>BP:</span>
                                        <span className="font-medium">{log.bloodPressureSystolic}/{log.bloodPressureDiastolic}</span>
                                        <span className="text-muted-foreground">mmHg</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Droplets className="h-4 w-4 text-blue-500" />
                                        <span>Sugar:</span>
                                        <span className="font-medium">{log.bloodSugar}</span>
                                        <span className="text-muted-foreground">mg/dL</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
