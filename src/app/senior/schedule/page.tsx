import { Header } from '@/components/Header';
import { ScheduleView } from './components/ScheduleView';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SchedulePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Today's Schedule</h1>
        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleView />
        </Suspense>
      </main>
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
