'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Phone, Pill, Calendar, Siren, Languages, ClipboardPlus, Camera, Settings } from 'lucide-react';
import { CallDialog } from './CallDialog';
import { SosDialog } from './SosDialog';

export function ActionButtons() {
  const { toast } = useToast();

  const handleAction = (action: string, description: string) => {
    toast({
      title: `기록된 활동: ${action}`,
      description: `${description} (${new Date().toLocaleTimeString()})`,
    });
    // In a real app, this would trigger a server action to save to Firestore.
    console.log(`Action: ${action}, Timestamp: ${new Date().toISOString()}`);
  };

  const actions = [
    {
      label: '전화',
      icon: Phone,
      className: "bg-primary text-primary-foreground hover:bg-primary/90",
      isDialog: true,
    },
    {
      label: '복약',
      icon: Pill,
      className: "bg-primary text-primary-foreground hover:bg-primary/90",
      action: () => handleAction('복약', '복약 확인이 기록되었습니다.'),
    },
    {
      label: '일정 보기',
      icon: Calendar,
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      isLink: true,
      href: '/senior/schedule',
    },
    {
      label: '번역',
      icon: Languages,
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      isLink: true,
      href: '/senior/translate',
    },
    {
      label: '건강 기록',
      icon: ClipboardPlus,
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      isLink: true,
      href: '/senior/health',
    },
    {
      label: '약 성분 확인',
      icon: Camera,
      className: "bg-accent text-accent-foreground hover:bg-accent/90",
      isLink: true,
      href: '/senior/medication-check',
    },
    {
      label: '알림 설정',
      icon: Settings,
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      isLink: true,
      href: '/senior/settings',
    },
  ];

  const emergencyAction = {
    label: '긴급 호출',
    icon: Siren,
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="w-full">
        <SosDialog>
            <Button
                className={`w-full h-56 rounded-2xl shadow-lg transition-transform hover:scale-105 ${emergencyAction.className}`}
                aria-label={emergencyAction.label}
            >
                <div className="flex flex-col items-center justify-center gap-4">
                    <emergencyAction.icon className="h-28 w-28" />
                    <span className="text-4xl font-bold">
                        {emergencyAction.label}
                    </span>
                </div>
            </Button>
        </SosDialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 w-full">
        {actions.map((item) => {
          const content = (
            <div className="flex flex-col items-center justify-center gap-4">
              <item.icon className="h-20 w-20 sm:h-24 sm:w-24" />
              <span className="text-2xl sm:text-3xl font-bold">
                {item.label}
              </span>
            </div>
          );

          const buttonClasses = `w-full h-48 rounded-2xl shadow-lg transition-transform hover:scale-105 ${item.className}`;
          
          if (item.isDialog) {
            return (
              <div key={item.label}>
                <CallDialog>
                  <Button
                    className={buttonClasses}
                    aria-label={item.label}
                  >
                    {content}
                  </Button>
                </CallDialog>
              </div>
            );
          }

          if (item.isLink) {
            return (
              <div key={item.label}>
                <Link href={item.href || ''} passHref>
                  <Button
                    className={buttonClasses}
                    aria-label={item.label}
                  >
                    {content}
                  </Button>
                </Link>
              </div>
            );
          }

          return (
            <div key={item.label}>
              <Button
                className={buttonClasses}
                onClick={item.action}
                aria-label={item.label}
              >
                {content}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
