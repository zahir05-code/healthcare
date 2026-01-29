import { Header } from '@/components/Header';
import { StatusSummary } from './components/StatusSummary';
import { CheckLog } from './components/CheckLog';
import { WeeklyReport } from './components/WeeklyReport';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GuardianPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">보호자 대시보드</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Suspense fallback={<Skeleton className="h-40" />}>
                <StatusSummary />
              </Suspense>
            </div>
            <div className="lg:col-span-2">
              <Suspense fallback={<Skeleton className="h-96" />}>
                <CheckLog />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<Skeleton className="h-96" />}>
                <WeeklyReport />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
