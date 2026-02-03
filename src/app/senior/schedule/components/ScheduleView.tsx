'use client';

import { schedules } from '@/lib/mock-data';
import type { Schedule } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pill, Stethoscope, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
    const [notificationPermission, setNotificationPermission] = useState('default');
    const scheduledNotifications = useRef(new Set());
    const { toast } = useToast();

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const requestNotificationPermission = () => {
        if (!('Notification' in window)) {
            toast({
                variant: 'destructive',
                title: '알림 미지원',
                description: '이 브라우저에서는 알림을 지원하지 않습니다.',
            });
            return;
        }

        Notification.requestPermission().then((permission) => {
            setNotificationPermission(permission);
            if (permission === 'granted') {
                toast({
                    title: '알림이 활성화되었습니다',
                    description: '일정 시간에 맞춰 알려드릴게요.',
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: '알림이 차단되었습니다',
                    description: '브라우저 설정에서 알림 권한을 허용해주세요.',
                });
            }
        });
    };

    useEffect(() => {
        if (notificationPermission === 'granted') {
            const upcomingSchedules = schedules.filter(s => s.startTime >= new Date());
            
            upcomingSchedules.forEach((item) => {
                const delay = item.startTime.getTime() - new Date().getTime();
                if (delay > 0 && !scheduledNotifications.current.has(item.id)) {
                    scheduledNotifications.current.add(item.id);
                    setTimeout(() => {
                        new Notification(`🔔 ${item.title}`, {
                            body: item.description,
                            vibrate: [200, 100, 200],
                        });
                        scheduledNotifications.current.delete(item.id);
                    }, delay);
                }
            });
        }
    }, [notificationPermission]);

    const upcomingSchedules = schedules
        .filter(s => s.startTime >= new Date())
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    return (
        <div className="space-y-4 max-w-2xl mx-auto w-full">
            {notificationPermission !== 'granted' && (
                <Card className="shadow-md bg-primary/10 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Bell className="h-6 w-6 text-primary" />
                            일정 알림 받기
                        </CardTitle>
                        <CardDescription>
                            약 먹을 시간이나 병원 예약 시간을 놓치지 않도록 알려드릴까요?
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={requestNotificationPermission}>
                            네, 알림을 받을래요
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            이 기능을 사용하려면 브라우저에서 알림을 허용해야 합니다.
                        </p>
                    </CardContent>
                </Card>
            )}

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
