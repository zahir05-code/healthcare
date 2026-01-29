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
  bloodPressureSystolic: z.coerce.number().min(50, "Invalid value").max(300, "Invalid value"),
  bloodPressureDiastolic: z.coerce.number().min(30, "Invalid value").max(200, "Invalid value"),
  bloodSugar: z.coerce.number().min(30, "Invalid value").max(600, "Invalid value"),
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
        title: 'Health Log Saved',
        description: 'Your vitals have been recorded successfully.',
      });
      form.reset();
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <p className="font-medium">Blood Pressure (mmHg)</p>
                <div className="flex gap-4">
                    <FormField
                    control={form.control}
                    name="bloodPressureSystolic"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Systolic</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 120" {...field} />
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
                        <FormLabel>Diastolic</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 80" {...field} />
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
                  <FormLabel>Blood Sugar (mg/dL)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Save Record
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
