'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Phone, Pill, Calendar, Siren, Languages, ClipboardPlus } from 'lucide-react';
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
      color: 'bg-green-500 hover:bg-green-600',
      isDialog: true,
    },
    {
      label: '복약',
      icon: Pill,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => handleAction('복약', '복약 확인이 기록되었습니다.'),
    },
    {
      label: '일정 보기',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      isLink: true,
      href: '/senior/schedule',
    },
    {
      label: '번역',
      icon: Languages,
      color: 'bg-orange-500 hover:bg-orange-600',
      isLink: true,
      href: '/senior/translate',
    },
    {
      label: '건강 기록',
      icon: ClipboardPlus,
      color: 'bg-teal-500 hover:bg-teal-600',
      isLink: true,
      href: '/senior/health',
    },
    {
      label: '긴급 호출',
      icon: Siren,
      color: 'bg-red-600 hover:bg-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl mx-auto">
      {actions.map((item) => {
        const content = (
          <div className="flex flex-col items-center justify-center gap-4">
            <item.icon className="h-16 w-16 sm:h-24 sm:w-24 text-white" />
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {item.label}
            </span>
          </div>
        );

        const buttonClasses = `w-full h-48 rounded-2xl shadow-lg transition-transform hover:scale-105 ${item.color}`;

        if (item.label === '긴급 호출') {
            return (
                <SosDialog key={item.label}>
                    <Button
                        className={buttonClasses}
                        aria-label={item.label}
                    >
                        {content}
                    </Button>
                </SosDialog>
            );
        }

        if (item.isDialog) {
          return (
            <CallDialog key={item.label}>
              <Button
                className={buttonClasses}
                aria-label={item.label}
              >
                {content}
              </Button>
            </CallDialog>
          );
        }

        if (item.isLink) {
          return (
            <Link href={item.href || ''} key={item.label} passHref className={item.className}>
              <Button
                className={buttonClasses}
                aria-label={item.label}
              >
                {content}
              </Button>
            </Link>
          );
        }

        return (
          <Button
            key={item.label}
            className={`${buttonClasses} ${item.className || ''}`}
            onClick={item.action}
            aria-label={item.label}
          >
            {content}
          </Button>
        );
      })}
    </div>
  );
}
