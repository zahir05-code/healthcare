'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Shield, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const { isLoggedIn, login } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold text-gray-800 dark:text-gray-200">
          케어커넥트
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          어르신을 위한 든든한 디지털 도우미입니다.
        </p>
      </div>

      {isLoggedIn ? (
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/senior" passHref>
            <Button
              className="h-32 w-64 text-xl flex flex-col gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-blue-500 hover:bg-blue-600 text-white"
              aria-label="어르신 대시보드로 가기"
            >
              <Users className="w-10 h-10 text-white" />
              <span>어르신</span>
            </Button>
          </Link>
          <Link href="/guardian" passHref>
            <Button
              className="h-32 w-64 text-xl flex flex-col gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-pink-500 hover:bg-pink-600 text-white"
              aria-label="보호자 대시보드로 가기"
            >
              <Shield className="w-10 h-10 text-white" />
              <span>보호자</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-xl text-muted-foreground">서비스를 이용하려면 로그인하세요.</p>
            <Button onClick={login} size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                로그인
            </Button>
        </div>
      )}
    </main>
  );
}
