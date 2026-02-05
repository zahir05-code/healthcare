'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, AlertCircle } from 'lucide-react';
import { shareToKakao, initKakaoSDK, isDemoMode } from '@/lib/kakao';
import { useToast } from '@/hooks/use-toast';

interface KakaoShareButtonProps {
    title: string;
    description: string;
    imageUrl?: string;
    buttonText?: string;
    linkUrl?: string;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children?: React.ReactNode;
}

export function KakaoShareButton({
    title,
    description,
    imageUrl,
    buttonText = '자세히 보기',
    linkUrl,
    variant = 'outline',
    size = 'default',
    className = '',
    children,
}: KakaoShareButtonProps) {
    const { toast } = useToast();
    const [shared, setShared] = useState(false);

    const handleShare = useCallback(() => {
        // 데모 모드 체크
        if (isDemoMode()) {
            toast({
                title: '데모 모드',
                description: '카카오 API 키가 설정되지 않아 데모 모드로 동작합니다. 실제 공유는 되지 않습니다.',
                variant: 'default',
            });
            setShared(true);
            setTimeout(() => setShared(false), 2000);
            return;
        }

        // SDK 초기화
        if (!initKakaoSDK()) {
            toast({
                title: '카카오 SDK 오류',
                description: '카카오 SDK를 초기화할 수 없습니다. 잠시 후 다시 시도해주세요.',
                variant: 'destructive',
            });
            return;
        }

        // 공유 실행
        const success = shareToKakao({
            title,
            description,
            imageUrl,
            buttonText,
            linkUrl,
        });

        if (success) {
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        } else {
            toast({
                title: '공유 실패',
                description: '카카오톡 공유에 실패했습니다. 다시 시도해주세요.',
                variant: 'destructive',
            });
        }
    }, [title, description, imageUrl, buttonText, linkUrl, toast]);

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleShare}
            className={`bg-[#FEE500] hover:bg-[#FDD800] text-black border-none ${className}`}
        >
            {shared ? (
                <Check className="mr-2 h-4 w-4" />
            ) : (
                <Share2 className="mr-2 h-4 w-4" />
            )}
            {children || '카카오톡 공유'}
        </Button>
    );
}

// 예약 정보 공유 전용 버튼
export function KakaoShareAppointmentButton({
    appointmentDate,
    hospitalName,
    doctorName,
    className,
}: {
    appointmentDate: string;
    hospitalName: string;
    doctorName?: string;
    className?: string;
}) {
    return (
        <KakaoShareButton
            title={`${hospitalName} 예약 알림`}
            description={`예약일시: ${appointmentDate}${doctorName ? `\n담당의: ${doctorName}` : ''}`}
            buttonText="예약 확인하기"
            className={className}
        >
            예약 정보 공유
        </KakaoShareButton>
    );
}

// 건강 정보 공유 전용 버튼
export function KakaoShareHealthButton({
    healthInfo,
    className,
}: {
    healthInfo: string;
    className?: string;
}) {
    return (
        <KakaoShareButton
            title="건강 정보 알림"
            description={healthInfo}
            buttonText="자세히 보기"
            className={className}
        >
            건강 정보 공유
        </KakaoShareButton>
    );
}
