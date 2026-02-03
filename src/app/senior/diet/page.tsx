'use client';

import { Header } from '@/components/Header';
import { DietForm } from './components/DietForm';
import { Suspense, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeDiet, type AnalyzeDietInput, type AnalyzeDietOutput } from '@/ai/flows/analyze-diet-flow';
import { DietAnalysisReport } from './components/DietAnalysisReport';
import { useToast } from '@/hooks/use-toast';

export default function DietPage() {
  const [analysis, setAnalysis] = useState<AnalyzeDietOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyzeDiet = async (dietInput: AnalyzeDietInput) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeDiet(dietInput);
      if (result.analysis.length === 0 && result.summary.includes("기록된 식단이 없습니다")) {
        toast({
            variant: "destructive",
            title: "분석 실패",
            description: result.summary,
        });
      } else {
        setAnalysis(result);
        toast({
            title: "식단 분석 완료",
            description: "아래에서 분석 결과를 확인하세요.",
        });
      }
    } catch (error) {
      console.error("Diet analysis error:", error);
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "식단 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">오늘의 식단 기록</h1>
        <Suspense fallback={<Skeleton className="h-96 w-full max-w-2xl" />}>
          <DietForm onAnalyze={handleAnalyzeDiet} isLoading={isLoading} />
        </Suspense>

        {analysis && (
          <Suspense fallback={<Skeleton className="h-96 w-full max-w-2xl mt-8" />}>
            <DietAnalysisReport report={analysis} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
