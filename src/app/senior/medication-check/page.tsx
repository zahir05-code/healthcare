import { Header } from '@/components/Header';
import { MedicationCheck } from './components/MedicationCheck';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MedicationCheckPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">약 성분 확인</h1>
        <Suspense fallback={<Skeleton className="h-96 w-full max-w-2xl" />}>
          <MedicationCheck />
        </Suspense>
      </main>
    </div>
  );
}
