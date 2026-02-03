'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Shield, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();

  const handleStopSound = () => {
    if (typeof window !== 'undefined' && (window as any).stopAlarmSound) {
      (window as any).stopAlarmSound();
      toast({
        title: '알림 소리 정지됨',
        description: '현재 울리는 알림 소리가 꺼졌습니다.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: '정지할 알림 없음',
        description: '현재 울리는 알림이 없습니다.',
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
        <Button variant="ghost" onClick={handleStopSound}>
          <VolumeX className="mr-2 h-4 w-4" />
          알림 소리 끄기
        </Button>
      </div>
    </main>
  );
}
