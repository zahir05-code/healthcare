import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ExercisePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">오늘의 추천 운동</h1>
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>어르신을 위한 튼튼 하체 운동 (6분)</CardTitle>
            <CardDescription>의자를 잡고 안전하게 따라 해보세요. 매일 꾸준히 하면 더욱 좋습니다!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dLG89KmkA_c"
                title="어르신 하체 운동 영상"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-6 space-y-2 text-muted-foreground">
              <p>
                <strong>운동 순서:</strong> 이 영상은 세 가지 간단한 하체 운동을 각각 2분씩, 총 6분 동안 진행합니다.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>1단계 (2분):</strong> 제자리 걷기</li>
                <li><strong>2단계 (2분):</strong> 의자 스쿼트</li>
                <li><strong>3단계 (2분):</strong> 다리 옆으로 들어 올리기</li>
              </ul>
              <p className="pt-2 font-semibold text-destructive">
                <strong>주의사항:</strong> 운동 중 통증이 느껴지면 즉시 중단하세요. 넘어지지 않도록 반드시 의자나 벽을 잡고 운동하세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
