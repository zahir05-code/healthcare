'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';
import type { NotificationSettings } from '@/lib/types';

const SETTINGS_KEY = 'careconnect-notification-settings';

const settingsSchema = z.object({
  vitals: z.object({
    enabled: z.boolean(),
    time: z.string(),
  }),
  medication: z.object({
    enabled: z.boolean(),
    time: z.string(),
  }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultValues: SettingsFormValues = {
  vitals: { enabled: false, time: '09:00' },
  medication: { enabled: true, time: '08:00' },
};

export function NotificationSettingsForm() {
  const { toast } = useToast();
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        form.reset(parsedSettings);
      } catch (e) {
        console.error("Failed to parse notification settings:", e);
      }
    }
  }, [form]);

  const onSubmit = (data: SettingsFormValues) => {
    if (notificationPermission !== 'granted' && (data.medication.enabled || data.vitals.enabled)) {
      toast({
        variant: 'destructive',
        title: '알림 권한 필요',
        description: '알림을 받으려면 먼저 권한을 허용해주세요.',
      });
      return;
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    toast({
      title: '설정 저장됨',
      description: '알림 설정이 성공적으로 저장되었습니다.',
    });
  };

  const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
        toast({ variant: 'destructive', title: '알림 미지원', description: '사용 중인 브라우저에서는 알림을 지원하지 않습니다.' });
        return;
    }
    Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
            toast({ title: '알림이 활성화되었습니다', description: '이제 시간 알림을 받을 수 있습니다.' });
        } else {
            toast({ variant: 'destructive', title: '알림이 차단되었습니다', description: '브라우저 설정에서 알림 권한을 직접 허용해주세요.' });
        }
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>시간 지정 알림</CardTitle>
        <CardDescription>
          활력 징후 측정 시간과 약 복용 시간을 설정하여 알림을 받으세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {notificationPermission !== 'granted' && (
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                알림 권한 필요
              </CardTitle>
              <CardDescription>
                알림을 받으려면 브라우저에서 권한을 허용해야 합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={requestNotificationPermission}>
                알림 권한 요청
              </Button>
            </CardContent>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="medication.enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">약 복용 시간 알림</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch('medication.enabled') && (
              <FormField
                control={form.control}
                name="medication.time"
                render={({ field }) => (
                  <FormItem className="pl-4 -mt-2">
                    <FormLabel>복용 시간</FormLabel>
                    <FormControl>
                      <Input type="time" className="w-48" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="vitals.enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">활력 징후 측정 알림</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch('vitals.enabled') && (
              <FormField
                control={form.control}
                name="vitals.time"
                render={({ field }) => (
                  <FormItem className="pl-4 -mt-2">
                    <FormLabel>측정 시간</FormLabel>
                    <FormControl>
                      <Input type="time" className="w-48" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full">
              설정 저장
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
