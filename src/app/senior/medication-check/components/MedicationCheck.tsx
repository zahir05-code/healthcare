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

  useEffect(() => {
    const getCameraPermission = async () => {
      if (hasCameraPermission) return;
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: '카메라 접근 거부됨',
          description: '브라우저 설정에서 카메라 권한을 허용해주세요.',
        });
      }
    };

    if(!capturedImage) {
        getCameraPermission();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasCameraPermission, toast, stream, capturedImage]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setHasCameraPermission(null);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzePill({ photoDataUri: capturedImage });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: 'destructive',
        title: '분석 오류',
        description: '약 성분을 분석하는 데 실패했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>사진으로 약 성분 확인</CardTitle>
        <CardDescription>약을 카메라 중앙에 놓고 촬영 버튼을 누르세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            {hasCameraPermission === false && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                 <XCircle className="h-12 w-12 text-destructive mb-2" />
                 <p className="font-semibold">카메라 접근이 필요합니다</p>
                 <p className="text-sm text-muted-foreground">설정에서 카메라 권한을 허용해주세요.</p>
              </div>
            )}
            
            {hasCameraPermission && !capturedImage && (
              <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            )}

            {capturedImage && (
              <img src={capturedImage} alt="캡처된 약 사진" className="h-full w-full object-contain" />
            )}

            {hasCameraPermission === null && !capturedImage && (
                 <div className="flex items-center justify-center h-full">
                    <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                 </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex gap-4">
            {!capturedImage && (
              <Button onClick={handleCapture} className="w-full" disabled={!hasCameraPermission}>
                <Camera className="mr-2" />
                촬영하기
              </Button>
            )}

            {capturedImage && !analysisResult && !isLoading && (
              <>
                <Button onClick={handleRetake} variant="outline" className="w-full">
                  <RefreshCcw className="mr-2" />
                  다시 찍기
                </Button>
                <Button onClick={handleAnalyze} className="w-full">
                   <Sparkles className="mr-2" />
                  성분 분석
                </Button>
              </>
            )}
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin" />
              <p className="ml-4 text-muted-foreground">AI가 약을 분석하는 중입니다...</p>
            </div>
          )}

          {analysisResult && (
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
               <Button onClick={handleRetake} variant="outline" className="w-full">
                  <RefreshCcw className="mr-2" />
                  새로운 약 촬영하기
                </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
