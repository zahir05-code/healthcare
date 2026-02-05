'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LoginDialog } from '@/components/LoginDialog';
import { KakaoShareButton, KakaoShareAppointmentButton } from '@/components/KakaoShareButton';
import { KakaoNotification } from '@/components/KakaoNotification';
import { KakaoMap } from '@/components/KakaoMap';
import { initKakaoSDK, isDemoMode } from '@/lib/kakao';
import { ArrowLeft, LogOut, User, MessageCircle, Share2, Bell, MapPin, AlertTriangle } from 'lucide-react';

function KakaoDemoContent() {
    const { isLoggedIn, user, logout } = useAuth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // 카카오 SDK 초기화
        initKakaoSDK();
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <Link href="/" className="flex items-center gap-2 mr-4">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm">홈으로</span>
                    </Link>
                    <h1 className="text-lg font-semibold flex-1">카카오 연동 데모</h1>

                    {/* 로그인 상태 */}
                    {isLoggedIn && user ? (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profileImage} alt={user.nickname} />
                                <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium">{user.nickname}</p>
                                <Badge variant="outline" className="text-xs">
                                    {user.loginType === 'kakao' ? '카카오' : '이메일'}
                                </Badge>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <LoginDialog>
                            <Button variant="outline" size="sm">
                                <User className="h-4 w-4 mr-2" />
                                로그인
                            </Button>
                        </LoginDialog>
                    )}
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="container py-6">
                {/* 데모 모드 안내 */}
                {isDemoMode() && (
                    <div className="mb-6 flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">데모 모드</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                카카오 API 키가 설정되지 않아 데모 모드로 동작합니다.
                                실제 기능을 사용하려면 <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env.local</code>에 API 키를 설정하세요.
                            </p>
                        </div>
                    </div>
                )}

                {/* 탭 콘텐츠 */}
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="login" className="flex items-center gap-1 text-xs sm:text-sm">
                            <MessageCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">로그인</span>
                        </TabsTrigger>
                        <TabsTrigger value="share" className="flex items-center gap-1 text-xs sm:text-sm">
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">공유</span>
                        </TabsTrigger>
                        <TabsTrigger value="notification" className="flex items-center gap-1 text-xs sm:text-sm">
                            <Bell className="h-4 w-4" />
                            <span className="hidden sm:inline">알림톡</span>
                        </TabsTrigger>
                        <TabsTrigger value="map" className="flex items-center gap-1 text-xs sm:text-sm">
                            <MapPin className="h-4 w-4" />
                            <span className="hidden sm:inline">지도</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* 카카오 로그인 */}
                    <TabsContent value="login">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5 text-yellow-500" />
                                        카카오 로그인
                                    </CardTitle>
                                    <CardDescription>
                                        카카오 계정으로 간편하게 로그인할 수 있습니다.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isLoggedIn && user ? (
                                        <div className="text-center space-y-4">
                                            <Avatar className="h-20 w-20 mx-auto">
                                                <AvatarImage src={user.profileImage} alt={user.nickname} />
                                                <AvatarFallback className="text-2xl">{user.nickname[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-lg">{user.nickname}</p>
                                                <Badge className="mt-1">
                                                    {user.loginType === 'kakao' ? '카카오 로그인' : '일반 로그인'}
                                                </Badge>
                                            </div>
                                            <Button variant="outline" onClick={logout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                로그아웃
                                            </Button>
                                        </div>
                                    ) : (
                                        <LoginDialog>
                                            <Button className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-black">
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                카카오로 로그인
                                            </Button>
                                        </LoginDialog>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>기능 설명</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>✅ 카카오 OAuth 인증으로 간편 로그인</p>
                                    <p>✅ 사용자 프로필, 닉네임 자동 연동</p>
                                    <p>✅ 로그아웃 시 카카오 세션 정리</p>
                                    <p>✅ 데모 모드에서도 테스트 가능</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* 카카오톡 공유 */}
                    <TabsContent value="share">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Share2 className="h-5 w-5 text-yellow-500" />
                                        카카오톡 공유
                                    </CardTitle>
                                    <CardDescription>
                                        예약 정보나 건강 정보를 카카오톡으로 공유할 수 있습니다.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <KakaoShareButton
                                        title="헬스케어 앱"
                                        description="어르신과 보호자를 위한 디지털 건강 비서입니다."
                                        buttonText="앱 확인하기"
                                    />

                                    <KakaoShareAppointmentButton
                                        hospitalName="서울대학교병원"
                                        appointmentDate="2026년 2월 10일 오후 2시"
                                        doctorName="김철수 교수"
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>기능 설명</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>✅ 커스텀 메시지로 공유</p>
                                    <p>✅ 예약 정보 공유 전용 버튼</p>
                                    <p>✅ 건강 정보 공유 전용 버튼</p>
                                    <p>✅ 이미지 및 링크 포함 가능</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* 알림톡 */}
                    <TabsContent value="notification">
                        <div className="grid gap-6 md:grid-cols-2">
                            <KakaoNotification
                                onSend={(data) => console.log('알림톡 발송:', data)}
                            />

                            <Card>
                                <CardHeader>
                                    <CardTitle>기능 설명</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>✅ 예약 알림 템플릿</p>
                                    <p>✅ 복약 알림 템플릿</p>
                                    <p>✅ 건강검진 안내 템플릿</p>
                                    <p>✅ 사용자 정의 메시지 발송</p>
                                    <p className="text-yellow-600 dark:text-yellow-400">
                                        ⚠️ 실제 발송은 카카오 비즈니스 채널 등록 필요
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* 카카오맵 */}
                    <TabsContent value="map">
                        <div className="grid gap-6">
                            <KakaoMap
                                height="500px"
                                showSearch={true}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

export default function KakaoPage() {
    return (
        <AuthProvider>
            <KakaoDemoContent />
        </AuthProvider>
    );
}
