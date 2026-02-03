'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AnalyzeDietOutput } from "@/ai/flows/analyze-diet-flow";
import { AlertCircle, CheckCircle2, Apple, Beef, Carrot, Droplet, Milk, Wheat } from 'lucide-react';

const statusConfig = {
    '부족': {
        indicatorColor: 'bg-accent',
        textColor: 'text-accent',
        label: '부족',
        icon: <AlertCircle className="h-4 w-4 text-accent" />
    },
    '적정': {
        indicatorColor: 'bg-primary',
        textColor: 'text-primary',
        label: '적정',
        icon: <CheckCircle2 className="h-4 w-4 text-primary" />
    },
    '과다': {
        indicatorColor: 'bg-destructive',
        textColor: 'text-destructive',
        label: '과다',
        icon: <AlertCircle className="h-4 w-4 text-destructive" />
    }
};

const groupIcons: { [key: string]: React.ReactNode } = {
    '곡물': <Wheat className="h-5 w-5 text-yellow-600" />,
    '단백질': <Beef className="h-5 w-5 text-red-600" />,
    '채소': <Carrot className="h-5 w-5 text-green-600" />,
    '과일': <Apple className="h-5 w-5 text-pink-500" />,
    '유제품': <Milk className="h-5 w-5 text-gray-500" />,
    '지방': <Droplet className="h-5 w-5 text-orange-400" />
};

interface DietAnalysisReportProps {
  report: AnalyzeDietOutput;
}

export function DietAnalysisReport({ report }: DietAnalysisReportProps) {
    
    const defaultGroups = ['곡물', '단백질', '채소', '과일', '유제품', '지방'];
    const reportedGroups = new Set(report.analysis.map(a => a.group));
    const allAnalyses = [...report.analysis];

    defaultGroups.forEach(group => {
        if (!reportedGroups.has(group as any)) {
            allAnalyses.push({
                group: group as any,
                status: '부족',
                recommendation: '기록에서 이 식품군을 찾을 수 없었어요.'
            });
        }
    });

  return (
    <Card className="w-full max-w-2xl mt-8">
      <CardHeader>
        <CardTitle>오늘의 식단 분석 결과</CardTitle>
        <CardDescription>{report.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {allAnalyses.map((item) => {
          const config = statusConfig[item.status];
          const progressValue = item.status === '부족' ? 33 : item.status === '적정' ? 66 : 100;

          return (
            <div key={item.group}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {groupIcons[item.group] || <Wheat className="h-5 w-5" />}
                    <span className="font-semibold">{item.group}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {config.icon}
                    <span className={cn('font-medium', config.textColor)}>{config.label}</span>
                </div>
              </div>
              <Progress value={progressValue} indicatorClassName={config.indicatorColor} />
              <p className="text-sm text-muted-foreground mt-2">{item.recommendation}</p>
            </div>
          );
        })}
         <div className="text-xs text-muted-foreground pt-2 space-y-1 border-t">
            <p>
                * 이 AI 분석 결과는 일반적인 권장 사항이며, 참고용으로만 사용해주세요. 정확한 영양 상담은 반드시 의사 또는 전문 영양사와 상의하세요.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
