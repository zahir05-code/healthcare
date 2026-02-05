'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Bell, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 알림톡 타입 정의
type NotificationType = 'appointment' | 'medication' | 'checkup' | 'custom';

interface NotificationTemplate {
    type: NotificationType;
    title: string;
    template: string;
}

// 알림톡 템플릿
const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
    {
        type: 'appointment',
        title: '예약 알림',
        template: '안녕하세요, {{name}}님.\n{{hospital}}에서 알려드립니다.\n\n예약일시: {{date}}\n담당의: {{doctor}}\n\n내원 시 신분증을 지참해 주세요.',
    },
    {
        type: 'medication',
        title: '복약 알림',
        template: '안녕하세요, {{name}}님.\n\n복약 시간입니다.\n\n💊 {{medication}}\n복용량: {{dosage}}\n\n건강한 하루 되세요!',
    },
    {
        type: 'checkup',
        title: '검진 안내',
        template: '안녕하세요, {{name}}님.\n\n정기 건강검진 시기가 다가왔습니다.\n\n검진 항목: {{items}}\n권장 검진일: {{date}}\n\n건강검진 예약을 권해드립니다.',
    },
    {
        type: 'custom',
        title: '사용자 정의',
        template: '',
    },
];

interface KakaoNotificationProps {
    onSend?: (data: { phoneNumber: string; message: string; type: NotificationType }) => void;
}

export function KakaoNotification({ onSend }: KakaoNotificationProps) {
    const { toast } = useToast();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedType, setSelectedType] = useState<NotificationType>('appointment');
    const [message, setMessage] = useState(NOTIFICATION_TEMPLATES[0].template);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleTypeChange = (type: NotificationType) => {
        setSelectedType(type);
        const template = NOTIFICATION_TEMPLATES.find((t) => t.type === type);
        if (template && type !== 'custom') {
            setMessage(template.template);
        }
    };

    const handleSend = async () => {
        if (!phoneNumber) {
            toast({
                title: '전화번호 필요',
                description: '알림을 받을 전화번호를 입력해주세요.',
                variant: 'destructive',
            });
            return;
        }

        if (!message) {
            toast({
                title: '메시지 필요',
                description: '발송할 메시지를 입력해주세요.',
                variant: 'destructive',
            });
            return;
        }

        setIsSending(true);

        // 실제 알림톡 발송은 서버 사이드에서 처리해야 함
        // 여기서는 데모 목적으로 Mock 처리
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSending(false);
        setIsSent(true);

        toast({
            title: '알림톡 발송 완료 (데모)',
            description: `${phoneNumber}로 알림톡이 발송되었습니다. (실제 발송은 카카오 비즈니스 계정 필요)`,
        });

        if (onSend) {
            onSend({ phoneNumber, message, type: selectedType });
        }

        // 3초 후 초기화
        setTimeout(() => {
            setIsSent(false);
        }, 3000);
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-500" />
                    카카오 알림톡
                </CardTitle>
                <CardDescription>
                    환자에게 카카오 알림톡을 발송합니다.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 경고 메시지 */}
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        실제 알림톡 발송은 카카오 비즈니스 채널 등록이 필요합니다.
                        현재는 데모 모드로 동작합니다.
                    </p>
                </div>

                {/* 전화번호 입력 */}
                <div className="space-y-2">
                    <Label htmlFor="phone">수신자 전화번호</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="010-0000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>

                {/* 템플릿 선택 */}
                <div className="space-y-2">
                    <Label>알림 유형</Label>
                    <Select value={selectedType} onValueChange={(v) => handleTypeChange(v as NotificationType)}>
                        <SelectTrigger>
                            <SelectValue placeholder="알림 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {NOTIFICATION_TEMPLATES.map((template) => (
                                <SelectItem key={template.type} value={template.type}>
                                    {template.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 메시지 내용 */}
                <div className="space-y-2">
                    <Label htmlFor="message">메시지 내용</Label>
                    <Textarea
                        id="message"
                        placeholder="발송할 메시지를 입력하세요..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                        {`{{name}}, {{date}} 등의 변수는 실제 값으로 대체됩니다.`}
                    </p>
                </div>

                {/* 발송 버튼 */}
                <Button
                    onClick={handleSend}
                    disabled={isSending || isSent}
                    className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-black"
                >
                    {isSent ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            발송 완료
                        </>
                    ) : isSending ? (
                        <>
                            <Send className="mr-2 h-4 w-4 animate-pulse" />
                            발송 중...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            알림톡 발송
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
