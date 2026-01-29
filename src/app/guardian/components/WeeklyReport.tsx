'use client';

import { weeklyReport as reportData, seniorUser } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const chartData = [
  {
    name: 'This Week',
    adherence: reportData.medicationAdherence,
    goal: 100,
  },
];

const chartConfig = {
  adherence: {
    label: 'Adherence',
    color: 'hsl(var(--primary))',
  },
  goal: {
    label: 'Goal',
    color: 'hsl(var(--muted))',
  },
} satisfies ChartConfig;

export function WeeklyReport() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Weekly Report</CardTitle>
        <CardDescription>Summary for {seniorUser.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm text-muted-foreground italic mb-4">"{reportData.summary}"</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Activity Level:</span>
            <Badge variant="secondary" className="capitalize">{reportData.activityLevel}</Badge>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium">SOS Requests:</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${reportData.sosRequests > 0 ? 'text-red-500' : ''}`}>
                {reportData.sosRequests}
              </span>
              {reportData.sosRequests > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-semibold mb-2 text-center">Medication Adherence</h3>
          <div className="w-full h-48">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis domain={[0, 100]} unit="%" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="goal" fill="var(--color-goal)" radius={4} barSize={40} />
                <Bar dataKey="adherence" fill="var(--color-adherence)" radius={4} barSize={40} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
