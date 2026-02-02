'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, RefreshCcw, Sparkles, Loader, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzePill } from '@/ai/flows/medication-check-flow';
import type { AnalyzePillOutput } from '@/ai/flows/medication-check-flow';

export function MedicationCheck() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePillOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 이 효과는 카메라 권한을 얻는 것을 처리합니다.
  // 컴포넌트가 마운트될 때와 사용자가 사진을 다시 찍을 때 실행됩니다.
  useEffect(() => {
    const getCameraPermission = async () => {
      // 이미 권한이 있다면 다시 요청하지 않습니다.
      if (hasCameraPermission) return;
      try {
        // 사용자의 카메라에 접근을 요청합니다.
        // 'facingMode: "environment"'는 모바일 기기에서 후면 카메라를 사용하려고 시도합니다.
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        setHasCameraPermission(true);
        // 비디오 요소가 준비되면 카메라 스트림을 연결합니다.
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        // 사용자가 권한을 거부하면 이 오류가 발생합니다.
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        // 카메라 접근이 필요하다는 설명 메시지를 표시합니다.
        toast({
          variant: 'destructive',
          title: '카메라 접근 거부됨',
          description: '브라우저 설정에서 카메라 권한을 허용해주세요.',
        });
      }
    };

    // 아직 캡처된 이미지가 없을 때만 권한을 얻으려고 시도합니다.
    if(!capturedImage) {
        getCameraPermission();
    }

    // 정리 함수: 이 함수는 컴포넌트가 언마운트될 때 실행됩니다.
    // 배터리를 절약하기 위해 카메라 스트림을 중지합니다.
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasCameraPermission, toast, stream, capturedImage]);

  // 이 함수는 이미지를 분석하기 위해 호출됩니다.
  const handleAnalyze = async (imageUri: string) => {
    if (!imageUri) return;

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // 캡처된 이미지 데이터로 AI 플로우를 호출합니다.
      const result = await analyzePill({ photoDataUri: imageUri });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: 'destructive',
        title: '분석 오류',
        description: '약 성분을 분석하는 데 실패했습니다. 다시 시도해주세요.',
      });
      // 재시도를 허용하기 위해 오류 발생 시 상태를 초기화합니다.
      setCapturedImage(null);
      setAnalysisResult(null);
      setHasCameraPermission(null); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // 현재 비디오 프레임을 숨겨진 캔버스에 그립니다.
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        // 캔버스에서 이미지 데이터를 JPEG로 가져옵니다.
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        
        // 카메라 스트림을 중지합니다.
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        // *** 신규: 캡처 후 즉시 분석을 시작합니다. ***
        handleAnalyze(dataUri);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    // 권한을 null로 설정하면 useEffect가 다시 권한을 요청하도록 합니다.
    setHasCameraPermission(null);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>사진으로 약 성분 확인</CardTitle>
        <CardDescription>
          {analysisResult ? '분석 결과는 아래와 같습니다.' : '약을 카메라 중앙에 놓고 촬영 버튼을 누르세요.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            {/* 사례 1: 카메라 권한 거부됨 */}
            {hasCameraPermission === false && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                 <XCircle className="h-12 w-12 text-destructive mb-2" />
                 <p className="font-semibold">카메라 접근이 필요합니다</p>
                 <p className="text-sm text-muted-foreground">
                   이 기능을 사용하려면 카메라 접근 권한이 필요합니다. 브라우저 주소창 옆의 자물쇠 아이콘을 클릭하여 권한을 허용해주세요.
                 </p>
              </div>
            )}
            
            {/* 사례 2: 실시간 카메라 피드 표시 */}
            {hasCameraPermission && !capturedImage && !isLoading &&(
              <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            )}

            {/* 사례 3: 캡처된 이미지 표시 */}
            {capturedImage && !isLoading && (
              <img src={capturedImage} alt="캡처된 약 사진" className="h-full w-full object-contain" />
            )}

            {/* 사례 4: 로딩 상태 (카메라 또는 분석용) */}
            {(hasCameraPermission === null || isLoading) && (
                 <div className="flex flex-col items-center justify-center h-full">
                    <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      {isLoading ? 'AI가 약을 분석하는 중입니다...' : '카메라를 불러오는 중...'}
                    </p>
                 </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {/* --- 버튼 --- */}
          <div className="flex gap-4">
            {/* 카메라가 라이브일 때만 캡처 버튼 표시 */}
            {!capturedImage && !analysisResult && !isLoading &&(
              <Button onClick={handleCapture} className="w-full" disabled={!hasCameraPermission}>
                <Camera className="mr-2" />
                촬영 및 분석
              </Button>
            )}

            {/* 분석 완료 후 재촬영 버튼 표시 */}
            {analysisResult && !isLoading &&(
              <Button onClick={handleRetake} variant="outline" className="w-full">
                <RefreshCcw className="mr-2" />
                새로운 약 촬영하기
              </Button>
            )}
          </div>
          
          {/* --- 분석 결과 --- */}
          {analysisResult && !isLoading && (
            <div className="space-y-4 pt-4">
              <Alert variant={analysisResult.isPill ? 'default' : 'destructive'}>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>분석 결과</AlertTitle>
                <AlertDescription>
                  {analysisResult.isPill
                    ? `AI가 이 약을 '${analysisResult.pillName}' (으)로 식별했습니다.`
                    : '사진에서 약을 찾을 수 없습니다. 다시 시도해주세요.'}
                </AlertDescription>
              </Alert>

              {analysisResult.isPill && (
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">{analysisResult.pillName}의 주요 성분</h3>
                  {analysisResult.ingredients.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {analysisResult.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">주요 성분 정보를 찾을 수 없습니다.</p>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">
                    * 이 정보는 참고용이며, 정확한 복약 정보는 의사 또는 약사와 상담하세요.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
