'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Phone, Pill, Calendar, Siren, Languages, ClipboardPlus, Camera } from 'lucide-react';
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
      color: "bg-[linear-gradient(to_bottom,theme(colors.green.500)_50%,theme(colors.green.700)_50%)] hover:bg-[linear-gradient(to_bottom,theme(colors.green.600)_50%,theme(colors.green.800)_50%)]",
      isDialog: true,
    },
    {
      label: '복약',
      icon: Pill,
      color: "bg-[linear-gradient(to_bottom,theme(colors.blue.500)_50%,theme(colors.blue.700)_50%)] hover:bg-[linear-gradient(to_bottom,theme(colors.blue.600)_50%,theme(colors.blue.800)_50%)]",
      action: () => handleAction('복약', '복약 확인이 기록되었습니다.'),
    },
    {
      label: '일정 보기',
      icon: Calendar,
      color: "bg-[linear-gradient(to_bottom,theme(colors.purple.500)_50%,theme(colors.purple.700)_50%)] hover:bg-[linear-gradient(to_bottom,theme(colors.purple.600)_50%,theme(colors.purple.800)_50%)]",
      isLink: true,
      href: '/senior/schedule',
    },
    {
      label: '번역',
      icon: Languages,
      color: "bg-[linear-gradient(to_bottom,theme(colors.orange.500)_50%,theme(colors.orange.700)_50%)] hover:bg-[linear-gradient(to_bottom,theme(colors.orange.600)_50%,theme(colors.orange.800)_50%)]",
      isLink: true,
      href: '/senior/translate',
    },
    {
      label: '건강 기록',
      icon: ClipboardPlus,
      color: "bg-[linear-gradient(to_bottom,theme(colors.teal.500)_50%,theme(colors.teal.700)_50%)] hover:bg-[linear-gradient(to_bottom,theme(colors.teal.600)_50%,theme(colors.teal.800)_50%)]",
      isLink: true,
      href: '/senior/health',
    },
    {
      label: '약 성분 확인',
      icon: Camera,
      color: "bg-[linear-gradient(to_bottom,theme(colors.indigo.500)_50%,theme(colors.indigo.700)_50%)] hover:bg-[linear-gradient(to_bottom,theme(colors.indigo.600)_50%,theme(colors.indigo.800)_50%)]",
      isLink: true,
      href: '/senior/medication-check',
    },
    {
      label: '긴급 호출',
      icon: Siren,
      color: "bg-[linear-gradient(to_bottom,theme(colors.red.600)_50%,theme(colors.red.800)_50%)] hover:bg-[linear-gradient(to_bottom,theme(colors.red.700)_50%,theme(colors.red.900)_50%)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
      {actions.map((item, index) => {

        const isFullSpan = actions.length % 2 !== 0 && index === actions.length - 1 && actions.length > 4;

        const content = (
          <div className="flex flex-col items-center justify-center gap-4">
            <item.icon className="h-20 w-20 sm:h-24 sm:w-24 text-white" />
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {item.label}
            </span>
          </div>
        );

        const buttonClasses = `w-full h-48 rounded-2xl shadow-lg transition-transform hover:scale-105 ${item.color}`;
        
        const wrapperClasses = isFullSpan ? 'sm:col-span-3' : '';


        if (item.label === '긴급 호출') {
            return (
                <div key={item.label} className={wrapperClasses}>
                    <SosDialog>
                        <Button
                            className={buttonClasses}
                            aria-label={item.label}
                        >
                            {content}
                        </Button>
                    </SosDialog>
                </div>
            );
        }

        if (item.isDialog) {
          return (
            <div key={item.label} className={wrapperClasses}>
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
            <div key={item.label} className={wrapperClasses}>
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
          <div key={item.label} className={wrapperClasses}>
            <Button
              className={`${buttonClasses} ${item.className || ''}`}
              onClick={item.action}
              aria-label={item.label}
            >
              {content}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
