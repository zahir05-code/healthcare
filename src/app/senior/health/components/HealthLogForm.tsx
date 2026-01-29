'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { useState } from 'react';

const healthLogSchema = z.object({
  bloodPressureSystolic: z.coerce.number().min(50, "유효하지 않은 값").max(300, "유효하지 않은 값"),
  bloodPressureDiastolic: z.coerce.number().min(30, "유효하지 않은 값").max(200, "유효하지 않은 값"),
  bloodSugar: z.coerce.number().min(30, "유효하지 않은 값").max(600, "유효하지 않은 값"),
});

type HealthLogFormValues = z.infer<typeof healthLogSchema>;

export function HealthLogForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<HealthLogFormValues>({
    resolver: zodResolver(healthLogSchema),
    defaultValues: {
      bloodPressureSystolic: undefined,
      bloodPressureDiastolic: undefined,
      bloodSugar: undefined,
    },
  });

  const onSubmit = (data: HealthLogFormValues) => {
    setIsLoading(true);
    // In a real app, save to Firestore
    console.log(data);

    setTimeout(() => {
      toast({
        title: '건강 기록 저장됨',
        description: '활력 징후가 성공적으로 기록되었습니다.',
      });
      form.reset();
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 항목</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <p className="font-medium">혈압 (mmHg)</p>
                <div className="flex gap-4">
                    <FormField
                    control={form.control}
                    name="bloodPressureSystolic"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>수축기</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="예: 120" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="bloodPressureDiastolic"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>이완기</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="예: 80" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>

            <FormField
              control={form.control}
              name="bloodSugar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>혈당 (mg/dL)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="예: 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              기록 저장
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
