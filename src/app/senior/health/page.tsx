import { Header } from '@/components/Header';
import { HealthLogForm } from './components/HealthLogForm';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { HealthLogHistory } from './components/HealthLogHistory';

export default function HealthLogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">건강 기록</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            <div>
                <h2 className="text-2xl font-bold mb-4">활력 징후 기록</h2>
                <Suspense fallback={<Skeleton className="h-96" />}>
                  <HealthLogForm />
                </Suspense>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">과거 기록</h2>
                <Suspense fallback={<Skeleton className="h-96" />}>
                    <HealthLogHistory />
                </Suspense>
            </div>
        </div>
      </main>
    </div>
  );
}
