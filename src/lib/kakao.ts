// 카카오 SDK 타입 정의 및 유틸리티
// Kakao SDK Type Definition and Utilities

declare global {
  interface Window {
    Kakao: KakaoSDK;
    kakao: KakaoMapSDK;
  }
}

interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Auth: {
    login: (options: { success: (response: KakaoAuthResponse) => void; fail: (error: Error) => void }) => void;
    logout: (callback?: () => void) => void;
    getAccessToken: () => string | null;
  };
  API: {
    request: (options: { url: string; success: (response: KakaoUserResponse) => void; fail: (error: Error) => void }) => void;
  };
  Share: {
    sendDefault: (options: KakaoShareOptions) => void;
    createDefaultButton: (options: KakaoShareButtonOptions) => void;
  };
}

interface KakaoMapSDK {
  maps: {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMapInstance;
    Marker: new (options: KakaoMarkerOptions) => KakaoMarkerInstance;
    InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindowInstance;
    services: {
      Places: new () => KakaoPlacesService;
      Status: {
        OK: string;
        ZERO_RESULT: string;
        ERROR: string;
      };
    };
  };
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

interface KakaoMapInstance {
  setCenter: (latlng: KakaoLatLng) => void;
  setLevel: (level: number) => void;
  getCenter: () => KakaoLatLng;
}

interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMapInstance;
}

interface KakaoMarkerInstance {
  setMap: (map: KakaoMapInstance | null) => void;
  getPosition: () => KakaoLatLng;
}

interface KakaoInfoWindowOptions {
  content: string;
  removable?: boolean;
}

interface KakaoInfoWindowInstance {
  open: (map: KakaoMapInstance, marker: KakaoMarkerInstance) => void;
  close: () => void;
}

interface KakaoPlacesService {
  keywordSearch: (
    keyword: string,
    callback: (result: KakaoPlaceResult[], status: string) => void
  ) => void;
}

interface KakaoPlaceResult {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string;
  y: string;
  category_name: string;
}

interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

interface KakaoUserResponse {
  id: number;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    email?: string;
    profile?: {
      nickname: string;
      profile_image_url?: string;
    };
  };
}

interface KakaoShareOptions {
  objectType: 'feed' | 'list' | 'commerce' | 'location' | 'text';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

interface KakaoShareButtonOptions extends KakaoShareOptions {
  container: string;
}

// 카카오 SDK 초기화
export const initKakaoSDK = (): boolean => {
  if (typeof window === 'undefined') return false;

  const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  if (!appKey) {
    console.warn('[카카오 SDK] NEXT_PUBLIC_KAKAO_JS_KEY가 설정되지 않았습니다.');
    return false;
  }

  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(appKey);
    console.log('[카카오 SDK] 초기화 완료');
    return true;
  }

  return window.Kakao?.isInitialized() ?? false;
};

// 카카오 로그인
export const kakaoLogin = (): Promise<KakaoUserResponse> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.Kakao) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
      return;
    }

    window.Kakao.Auth.login({
      success: () => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (response) => resolve(response),
          fail: (error) => reject(error),
        });
      },
      fail: (error) => reject(error),
    });
  });
};

// 카카오 로그아웃
export const kakaoLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.Kakao) {
      resolve();
      return;
    }

    if (window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout(() => {
        console.log('[카카오] 로그아웃 완료');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// 카카오톡 공유
export const shareToKakao = (options: {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  linkUrl?: string;
}): boolean => {
  if (typeof window === 'undefined' || !window.Kakao) {
    console.warn('[카카오 공유] SDK가 로드되지 않았습니다.');
    return false;
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const linkUrl = options.linkUrl || baseUrl;

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: options.title,
      description: options.description,
      imageUrl: options.imageUrl || `${baseUrl}/favicon.ico`,
      link: {
        mobileWebUrl: linkUrl,
        webUrl: linkUrl,
      },
    },
    buttons: [
      {
        title: options.buttonText || '자세히 보기',
        link: {
          mobileWebUrl: linkUrl,
          webUrl: linkUrl,
        },
      },
    ],
  });

  return true;
};

// 데모 모드 체크 (SDK 키가 없을 때)
export const isDemoMode = (): boolean => {
  return !process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
};

export type {
  KakaoUserResponse,
  KakaoShareOptions,
  KakaoPlaceResult,
  KakaoMapInstance,
  KakaoMarkerInstance,
  KakaoLatLng,
};
