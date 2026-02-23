'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Leaf,
  LogOut,
  Bell,
  MessageCircle,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { initKakaoSDK } from '@/lib/kakao';

export default function Home() {
  const { toast } = useToast();
  const { loginWithKakao, isLoading: isAuthLoading, isLoggedIn, logout, user } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const isLoading = isAuthLoading || localLoading;

  useEffect(() => {
    initKakaoSDK();
  }, []);

  const handleKakaoLogin = async () => {
    setLocalLoading(true);
    try {
      await loginWithKakao();
      toast({
        title: '로그인 성공',
        description: '카카오 계정으로 로그인되었습니다.',
      });
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      toast({
        variant: 'destructive',
        title: '로그인 실패',
        description: '카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-ghibli text-white flex flex-col selection:bg-yellow-200 selection:text-green-900 overflow-x-hidden font-sans">
      {/* Background Decor */}
      <div className="leaf-pattern-overlay absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPf_qurnapLxP8Ckk6iYMBw5lcjbkl1aciRkSNSSiVqfDUNLA6roETiPpAYx6H8BVKeLqXnSP3pNQHAX3OFuvDRrpRDmugZS8DNEmj4YAa1D83cMBayJpUNJC70eT_Yk-FPEV0_xqjeMyvnPIuazKSTZLnWFKN74wd5FxwmCTGh-RST2gV2pK2mId_75E7wcVUODL-5GBevFHCcHDmNMhfbAW6GfJcuBH8NutdDAOYmmtR5Rq-4pHHpmj9X6cOE1iRB2Zpqxk_oA8-')] bg-cover opacity-10 mix-blend-overlay pointer-events-none z-0" />

      {/* Decorative Leaves */}
      <div className="absolute top-[-5%] left-[-5%] w-64 h-64 text-white opacity-20 transform rotate-45 pointer-events-none z-0">
        <Leaf className="w-full h-full" />
      </div>
      <div className="absolute top-[-2%] right-[-5%] w-80 h-80 text-white opacity-20 transform -rotate-12 pointer-events-none z-0">
        <Leaf className="w-full h-full" />
      </div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 text-white opacity-10 transform -rotate-45 pointer-events-none z-0">
        <Leaf className="w-full h-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">헬스케어</span>
        </div>

        <div className="hidden md:flex gap-8 text-white/90 font-bold">
          <Link href="#" className="hover:text-white transition-colors">DS가족</Link>
          <Link href="#" className="hover:text-white transition-colors">효도 확인</Link>
          <Link href="#" className="hover:text-white transition-colors">병원 찾기</Link>
        </div>

        {isLoggedIn ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-white/20 text-white px-5 py-1.5 rounded-full text-xs transition-all shadow-lg"
          >
            <LogOut className="w-3 h-3 mr-2" />
            로그아웃
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-md border border-white/20 text-white px-5 py-1.5 rounded-full text-xs transition-all shadow-lg text-shadow-ghibli"
          >
            로그인
          </Button>
        )}
      </nav>

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-8 pb-20 flex flex-col items-center text-center flex-1">
        <div className="mb-10 space-y-2">
          <h2 className="text-emerald-950/60 font-black tracking-[0.2em] text-sm uppercase">PREMIUM HEALTHCARE</h2>
          <h1 className="text-4xl md:text-6xl font-black text-emerald-950 leading-tight tracking-tight text-shadow-ghibli">
            건강기록 디지털 도우미
          </h1>
          <p className="text-emerald-950/80 text-lg font-bold pt-2">
            어르신을 위한 든든한 디지털 도우미입니다.
          </p>
        </div>

        {/* Login Button */}
        {!isLoggedIn && (
          <div className="flex flex-col items-center gap-4 mb-16">
            <Button
              onClick={handleKakaoLogin}
              disabled={isLoading}
              className="bg-[#FEE500] hover:bg-yellow-400 text-black font-black py-7 px-10 rounded-full flex items-center gap-3 shadow-xl transform hover:scale-105 transition-all duration-300 w-full max-w-[320px] text-lg"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <MessageCircle className="w-6 h-6 fill-black" />
              )}
              카카오 로그인
            </Button>
            <p className="text-sm text-emerald-950 font-bold opacity-60">간편하게 카카오톡으로 시작하세요</p>
          </div>
        )}

        {/* Mode Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Senior Card */}
          <Link href="/senior" className="group">
            <div className="warm-card rounded-[2.5rem] p-6 md:p-10 flex flex-col h-full transform hover:translate-y-[-10px] transition-all duration-500 relative overflow-hidden premium-card">
              <div className="bg-white/90 rounded-[2rem] overflow-hidden h-64 mb-8 relative shadow-inner border border-yellow-100 flex items-center justify-center">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJF13i1SNZP_sZRJscHH3pkB900QRDHfsMfJk_xt1BuQ1_Y7KXaAYEot6PtRAUDQCANkroYpEBMCH7dSBPzOaAOGn9nxsmI75gk7_UB1hnkns4-wb_qkdRgFVAGauHt8RZqQk1OkdfZ1Obgjvt09412KmJU2UJkd-CfKpOSu8o8rYQblu1ho_Gq-7Ue0NS4kLOue6mW3IWypCt4mmcuXuViMiVStZeT9Y9nEZioeqVS3EiTbnQ1eA-DECZkAvCX9eaP_qmCfZuUOyM"
                  alt="어르신"
                  fill
                  className="object-cover object-top opacity-90 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-50/20 to-transparent"></div>
              </div>
              <div className="text-left mb-8">
                <h3 className="text-3xl font-black text-gray-800 mb-3 drop-shadow-sm">어르신</h3>
                <p className="text-gray-600 font-bold leading-relaxed opacity-90">
                  매일의 건강 수치를 쉽게 기록하고<br />
                  약 드실 시간을 알려드려요.
                </p>
              </div>
              <div className="mt-auto">
                <Button className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-black py-7 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-blue-200">
                  어르신으로 시작하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Guardian Card */}
          <Link href="/guardian" className="group">
            <div className="warm-card rounded-[2.5rem] p-6 md:p-10 flex flex-col h-full transform hover:translate-y-[-10px] transition-all duration-500 relative overflow-hidden premium-card">
              <div className="bg-white/90 rounded-[2rem] overflow-hidden h-64 mb-8 relative shadow-inner border border-yellow-100 flex items-center justify-center">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY9H1Rg9Ux4kdvTRIAr2XJDBe6ZVjkhrbrgDXhw0Pvqq2kg9iHGmxzgJCvP3dHdiJ0TFCmfO-IGT2GX9rLtHTbR4GZ0Zb7-kKnKZ8S21nvZH1hFpXnReYeqosO7m1SOIPi9u6JrgB9ohRNX62tase8fSpEaRK0wB21rWWO5BqjakFQZXSGAYYKOJfIzloAgR1cxYMtT0TeDDGM4fZeh-Zd5NsZd1ZKu8pzGrpWlS_iVET64U2dczAoBFG0Uv8jjFG3OTKyiLhkjd48"
                  alt="보호자"
                  fill
                  className="object-cover object-center opacity-90 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-50/10 to-transparent mix-blend-overlay"></div>
              </div>
              <div className="text-left mb-8">
                <h3 className="text-3xl font-black text-gray-800 mb-3 drop-shadow-sm">보호자</h3>
                <p className="text-gray-600 font-bold leading-relaxed opacity-90">
                  부모님의 건강 상태를 실시간으로 확인하고<br />
                  응급 상황 알림을 받으세요.
                </p>
              </div>
              <div className="mt-auto">
                <Button className="w-full bg-white hover:bg-gray-50 text-[#3B82F6] font-black py-7 rounded-2xl shadow-lg border border-blue-100 transition-all flex items-center justify-center gap-2">
                  보호자로 시작하기
                  <UserPlus className="w-5 h-5 text-[#3B82F6]" />
                </Button>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Notification Bar */}
        <div className="mt-16 w-full max-w-2xl glass-notification rounded-3xl p-5 flex items-center justify-between shadow-2xl relative overflow-hidden border border-white/40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] animate-shine"></div>
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-100">
              <Bell className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-white">알림 설정</p>
              <p className="text-xs text-green-100/80 font-bold">서비스 이용 중 필요한 매일 소식을 받아보세요</p>
            </div>
          </div>
          <div className="flex items-center gap-6 z-10 pr-2">
            <span className="text-xs font-black text-white hidden sm:block">푸시 소리 켜기</span>
            <div
              className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isNotificationEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
              onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isNotificationEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-8 py-8 mt-auto border-t border-white/10 bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-widest text-green-100/60 uppercase">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf className="w-3 h-3" />
            <span>HEALTHCARE DIGITAL ASSISTANT</span>
            <span className="hidden md:inline mx-4 opacity-30">|</span>
            <span>© 2024 헬스케어. All rights reserved.</span>
          </div>
          <div className="flex gap-8 font-bold">
            <Link href="#" className="hover:text-white transition-colors">이용약관</Link>
            <Link href="#" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="#" className="hover:text-white transition-colors">문의하기</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
