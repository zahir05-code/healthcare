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
      title: `Action Logged: ${action}`,
      description: `${description} at ${new Date().toLocaleTimeString()}`,
    });
    // In a real app, this would trigger a server action to save to Firestore.
    console.log(`Action: ${action}, Timestamp: ${new Date().toISOString()}`);
  };

  const actions = [
    {
      label: 'Call',
      icon: Phone,
      color: 'bg-green-500 hover:bg-green-600',
      isDialog: true,
    },
    {
      label: 'Medication',
      icon: Pill,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => handleAction('Medication', 'Medication taken confirmation logged.'),
    },
    {
      label: 'View Schedule',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      isLink: true,
      href: '/senior/schedule',
    },
    {
      label: 'Translate',
      icon: Languages,
      color: 'bg-orange-500 hover:bg-orange-600',
      isLink: true,
      href: '/senior/translate',
    },
    {
      label: 'Health Log',
      icon: ClipboardPlus,
      color: 'bg-teal-500 hover:bg-teal-600',
      isLink: true,
      href: '/senior/health',
    },
    {
      label: 'SOS',
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

        if (item.label === 'SOS') {
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
