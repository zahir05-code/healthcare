'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function KakaoLoginPage() {
  const [profile, setProfile] = useState<any>(null);

  // 카카오 SDK 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }
    }
  }, []);

  // 로그인 함수 (카카오 문서 참조)
  const loginWithKakao = () => {
    if (!window.Kakao) {
      alert('카카오 SDK가 로드되지 않았습니다.');
      return;
    }

    if (!process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
        alert('API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
        return;
    }

    window.Kakao.Auth.login({
      success: function (authObj: any) {
        console.log('로그인 성공:', authObj);
        
        // 사용자 정보 요청
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (res: any) {
            console.log('사용자 정보:', res);
            setProfile(res);
          },
          fail: function (error: any) {
            console.error('사용자 정보 요청 실패:', error);
            alert('사용자 정보를 가져오는데 실패했습니다.');
          },
        });
      },
      fail: function (err: any) {
        console.error('로그인 실패:', err);
        alert('로그인에 실패했습니다.');
      },
    });
  };

  // 로그아웃 함수
  const logout = () => {
    if (window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout(() => {
        console.log('로그아웃 되었습니다.');
        setProfile(null);
        alert('로그아웃 되었습니다.');
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">카카오톡 로그인 예제</h1>
        
        {!profile ? (
          <div className="flex flex-col items-center gap-4">
            <p className="mb-4 text-center text-gray-600">
              아래 버튼을 눌러 카카오 계정으로 로그인하세요.
            </p>
            {/* 공식 카카오 로그인 버튼 이미지 */}
            <a 
              id="kakao-login-btn" 
              href="#" 
              onClick={(e) => { e.preventDefault(); loginWithKakao(); }}
            >
              <img
                src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
                width="222"
                alt="카카오 로그인 버튼"
              />
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold text-green-600">로그인 성공!</h2>
            
            {/* 프로필 이미지 */}
            {profile.properties?.profile_image && (
              <img 
                src={profile.properties.profile_image} 
                alt="프로필 사진" 
                className="h-24 w-24 rounded-full border-4 border-yellow-400"
              />
            )}
            
            <div className="text-center">
              <p className="text-lg font-bold">{profile.properties?.nickname}님</p>
              <p className="text-sm text-gray-500">환영합니다!</p>
            </div>

            <div className="mt-4 w-full rounded bg-gray-50 p-4 text-left text-sm text-gray-600">
               <p><strong>회원번호:</strong> {profile.id}</p>
               <p><strong>이메일:</strong> {profile.kakao_account?.email || '비공개'}</p>
            </div>

            <button
              onClick={logout}
              className="mt-4 rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 transition"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-xs text-gray-500">
        <p>참고: 이 페이지는 Kakao JS SDK V2를 사용합니다.</p>
      </div>
    </div>
  );
}
