'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, FC, useCallback } from 'react';
import { kakaoLogin, kakaoLogout, isDemoMode, type KakaoUserResponse } from '@/lib/kakao';

interface User {
  id: string;
  nickname: string;
  profileImage?: string;
  email?: string;
  loginType: 'email' | 'kakao';
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: () => void;
  loginWithKakao: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 기존 이메일/전화번호 로그인
  const login = () => {
    setUser({
      id: 'local-user',
      nickname: '사용자',
      loginType: 'email',
    });
    setIsLoggedIn(true);
  };

  // 카카오 로그인
  const loginWithKakao = useCallback(async () => {
    setIsLoading(true);
    try {
      // 데모 모드일 경우 모의 로그인
      if (isDemoMode()) {
        console.log('[카카오 로그인] 데모 모드 - 모의 로그인 실행');
        setUser({
          id: 'kakao-demo-123',
          nickname: '카카오 사용자',
          profileImage: 'https://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV5DxA3FDEuK0/img_640x640.jpg',
          loginType: 'kakao',
        });
        setIsLoggedIn(true);
        return;
      }

      const response: KakaoUserResponse = await kakaoLogin();
      setUser({
        id: `kakao-${response.id}`,
        nickname: response.properties.nickname,
        profileImage: response.properties.profile_image,
        email: response.kakao_account?.email,
        loginType: 'kakao',
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('[카카오 로그인] 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    if (user?.loginType === 'kakao') {
      await kakaoLogout();
    }
    setUser(null);
    setIsLoggedIn(false);
    router.push('/');
  }, [user, router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, loginWithKakao, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
