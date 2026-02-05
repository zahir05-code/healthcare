'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LogIn, MessageCircle, Loader2 } from 'lucide-react';
import { initKakaoSDK } from '@/lib/kakao';

const loginSchema = z.object({
  identifier: z.string().min(1, { message: '이메일 또는 전화번호를 입력해주세요.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginDialog({ children }: { children: React.ReactNode }) {
  const { login, loginWithKakao, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [kakaoError, setKakaoError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log('Logging in with:', data.identifier);
    login();
    setIsOpen(false);
    form.reset();
  };

  const handleKakaoLogin = async () => {
    setKakaoError(null);
    try {
      // SDK 초기화 시도
      initKakaoSDK();
      await loginWithKakao();
      setIsOpen(false);
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      setKakaoError('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>
            서비스를 이용하려면 로그인하세요.
          </DialogDescription>
        </DialogHeader>

        {/* 카카오 로그인 버튼 */}
        <div className="py-4">
          <Button
            type="button"
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] font-medium"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageCircle className="mr-2 h-4 w-4" />
            )}
            카카오로 로그인
          </Button>
          {kakaoError && (
            <p className="text-sm text-red-500 mt-2 text-center">{kakaoError}</p>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              또는
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일 또는 전화번호</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
