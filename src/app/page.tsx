import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold text-gray-800 dark:text-gray-200">
          Welcome to CareConnect
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Your trusted digital assistant for senior care.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/senior" passHref>
          <Button
            variant="outline"
            className="h-32 w-64 text-xl flex flex-col gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            aria-label="Go to Senior's dashboard"
          >
            <Users className="w-10 h-10 text-primary" />
            <span>I'm a Senior</span>
          </Button>
        </Link>
        <Link href="/guardian" passHref>
          <Button
            variant="outline"
            className="h-32 w-64 text-xl flex flex-col gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            aria-label="Go to Guardian's dashboard"
          >
            <Shield className="w-10 h-10 text-primary" />
            <span>I'm a Guardian</span>
          </Button>
        </Link>
      </div>
    </main>
  );
}
