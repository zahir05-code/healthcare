import type { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { NotificationManager } from './senior/components/NotificationManager';

import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: '헬스케어',
  description: '어르신과 보호자를 위한 디지털 비서.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster />
          <NotificationManager />
        </AuthProvider>
        {/* 카카오 JavaScript SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmOGIdJLJEGSBdNE6ZN6S87Bsu"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* 카카오맵 SDK */}
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || ''}&libraries=services&autoload=false`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
