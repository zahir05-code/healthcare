import { Header } from '@/components/Header';
import { ActionButtons } from './components/ActionButtons';

export default function SeniorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <ActionButtons />
      </main>
    </div>
  );
}
