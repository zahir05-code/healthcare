'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Bell, Plus, Trash2 } from 'lucide-react';
import type { NotificationSettings } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const SETTINGS_KEY = 'careconnect-notification-settings';

const alarmSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "알림 이름을 입력해주세요."),
  time: z.string(),
  enabled: z.boolean(),
});

const settingsSchema = z.object({
  alarms: z.array(alarmSchema).max(10, "알림은 최대 10개까지 추가할 수 있습니다."),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultValues: SettingsFormValues = {
  alarms: [
    { id: '1', label: '아침 약 복용', time: '08:00', enabled: true },
    { id: '2', label: '활력 징후 측정', time: '09:00', enabled: true },
  ],
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
    defaultValues: { alarms: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "alarms",
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsedSettings: NotificationSettings = JSON.parse(savedSettings);
        form.reset({ alarms: parsedSettings });
      } catch (e) {
        console.error("Failed to parse notification settings:", e);
        form.reset(defaultValues);
      }
    } else {
      form.reset(defaultValues);
    }
  }, [form]);

  const onSubmit = (data: SettingsFormValues) => {
    const hasEnabledAlarms = data.alarms.some(alarm => alarm.enabled);
    if (notificationPermission !== 'granted' && hasEnabledAlarms) {
      toast({
        variant: 'destructive',
        title: '알림 권한 필요',
        description: '알림을 받으려면 먼저 권한을 허용해주세요.',
      });
      return;
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.alarms));
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
          하루 최대 10개까지 알림을 설정할 수 있습니다.
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
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                   <div className="flex justify-between items-start">
                     <div className="flex-1 space-y-4">
                        <FormField
                          control={form.control}
                          name={`alarms.${index}.label`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>알림 이름</FormLabel>
                              <FormControl>
                                <Input placeholder="예: 점심 약 복용" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="flex items-end gap-4">
                            <FormField
                                control={form.control}
                                name={`alarms.${index}.time`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>알림 시간</FormLabel>
                                    <FormControl>
                                    <Input type="time" className="w-40" {...field} />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`alarms.${index}.enabled`}
                                render={({ field: switchField }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <FormLabel className="mr-4">활성화</FormLabel>
                                        <FormControl>
                                            <Switch
                                            checked={switchField.value}
                                            onCheckedChange={switchField.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                     </div>
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="ml-2 mt-1"
                        aria-label="알림 삭제"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                   </div>
                </Card>
              ))}
            </div>

            {fields.length < 10 && (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => append({ id: Date.now().toString(), label: '', time: '12:00', enabled: true })}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    새 알림 추가
                </Button>
            )}
            {form.formState.errors.alarms?.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.alarms.root.message}</p>
            )}

            <Separator />

            <Button type="submit" className="w-full">
              설정 저장
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
