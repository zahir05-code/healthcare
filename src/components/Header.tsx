'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  backHref?: string;
};

export function Header({ backHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        {backHref && (
          <Button variant="ghost" size="icon" className="mr-4" asChild>
            <Link href={backHref}>
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">뒤로</span>
            </Link>
          </Button>
        )}
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.7-1 2.1 2 1.4-1 1.8 1h5.8" />
          </svg>
          <span className="text-xl font-bold text-foreground">케어커넥트</span>
        </Link>
        <div className="ml-auto"></div>
      </div>
    </header>
  );
}
