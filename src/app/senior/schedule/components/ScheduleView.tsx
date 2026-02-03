'use client';

import { schedules } from '@/lib/mock-data';
import type { Schedule } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pill, Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

function getIcon(type: Schedule['type']) {
    switch (type) {
        case 'medication':
            return <Pill className="h-6 w-6 text-accent" />;
        case 'appointment':
            return <Stethoscope className="h-6 w-6 text-accent" />;
        default:
            return <CalendarIcon className="h-6 w-6 text-accent" />;
    }
}

export function ScheduleView() {
    const upcomingSchedules = schedules
        .filter(s => s.startTime >= new Date())
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    return (
        <div className="space-y-4 max-w-2xl mx-auto w-full">
            {upcomingSchedules.length > 0 ? (
                upcomingSchedules.map((item) => (
                    <Card key={item.id} className="shadow-md">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                                    <CardDescription className="text-base">{item.description}</CardDescription>
                                </div>
                                {getIcon(item.type)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold text-primary">
                                {format(item.startTime, 'p', { locale: ko })}
                            </p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card className="shadow-md text-center">
                    <CardHeader>
                        <CardTitle>모두 완료!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">오늘 더 이상 예정된 일정이 없습니다.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
