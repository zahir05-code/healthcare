'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Shield, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();

  const handleDisableNotifications = () => {
    const SETTINGS_KEY = 'careconnect-notification-settings';
    try {
      const defaultSettings = {
        vitals: { enabled: false, time: '09:00' },
        medication: { enabled: true, time: '08:00' },
      };
      
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
      
      settings.vitals.enabled = false;
      settings.medication.enabled = false;

      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

      toast({
        title: '알림 해제됨',
        description: '모든 시간 지정 알림이 꺼졌습니다.',
      });
    } catch (error) {
      console.error('Failed to disable notifications:', error);
      toast({
        variant: 'destructive',
        title: '오류',
        description: '알림을 해제하는 중 오류가 발생했습니다.',
      });
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl font-bold">
            <span className="text-chart-1">케</span>
            <span className="text-chart-5">어</span>
            <span className="text-chart-4">커</span>
            <span className="text-chart-2">넥</span>
            <span className="text-chart-3">트</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            어르신을 위한 든든한 디지털 도우미입니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/senior" passHref>
            <Button
              className="h-32 w-64 text-xl flex flex-col gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label="어르신 대시보드로 가기"
            >
              <Users className="w-10 h-10" />
              <span>어르신</span>
            </Button>
          </Link>
          <Link href="/guardian" passHref>
            <Button
              className="h-32 w-64 text-xl flex flex-col gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              aria-label="보호자 대시보드로 가기"
            >
              <Shield className="w-10 h-10" />
              <span>보호자</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="pb-4">
        <Button variant="ghost" onClick={handleDisableNotifications}>
          <BellOff className="mr-2 h-4 w-4" />
          시간 알림 전체 해제
        </Button>
      </div>
    </main>
  );
}
