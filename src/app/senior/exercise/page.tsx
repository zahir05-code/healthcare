'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const exercises = [
  {
    id: 'lower-body',
    title: '튼튼 하체 운동 (6분)',
    bodyPart: '하체',
    description: '의자를 잡고 안전하게 따라 해보세요. 매일 꾸준히 하면 더욱 좋습니다!',
    videoId: 'dLG89KmkA_c',
    details: [
      '1단계 (2분): 제자리 걷기',
      '2단계 (2분): 의자 스쿼트',
      '3단계 (2분): 다리 옆으로 들어 올리기',
    ],
  },
  {
    id: 'upper-body',
    title: '활기찬 상체 운동 (7분)',
    bodyPart: '상체',
    description: '의자에 앉아서 편안하게 따라 할 수 있는 상체 근력 및 유연성 운동입니다.',
    videoId: 'Vd0_3-4t_pU',
    details: [
        '팔 앞으로 뻗기',
        '팔 위로 들어 올리기',
        '어깨 돌리기',
        '손목, 팔꿈치 풀기'
    ],
  },
  {
    id: 'full-body',
    title: '전신 유산소 운동 (15분)',
    bodyPart: '전신',
    description: '집에서 쉽게 따라하며 심폐지구력과 전신 근력을 키울 수 있는 운동입니다.',
    videoId: 'OeoD8v_5i_s',
    details: [
        '제자리 걷기',
        '가볍게 뛰기',
        '팔다리 교차 운동',
        '다양한 유산소 동작'
    ],
  },
  {
    id: 'stretching',
    title: '침대 스트레칭 (10분)',
    bodyPart: '스트레칭',
    description: '아침에 일어나서 또는 잠들기 전에 침대에서 편안하게 할 수 있는 전신 스트레칭입니다.',
    videoId: 's3Oacxv1Ksg',
    details: [
        '목 스트레칭',
        '어깨와 등 풀기',
        '허리 스트레칭',
        '다리 스트레칭'
    ],
  },
];


export default function ExercisePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">신체 부위별 추천 운동</h1>
        
        <Tabs defaultValue={exercises[0].id} className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-4">
            {exercises.map((exercise) => (
              <TabsTrigger key={exercise.id} value={exercise.id}>
                {exercise.bodyPart}
              </TabsTrigger>
            ))}
          </TabsList>
          {exercises.map((exercise) => (
            <TabsContent key={exercise.id} value={exercise.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{exercise.title}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${exercise.videoId}`}
                      title={`${exercise.bodyPart} 운동 영상`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="mt-6 space-y-2 text-muted-foreground">
                    <p>
                      <strong>운동 순서:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {exercise.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                    <p className="pt-2 font-semibold text-destructive">
                      <strong>주의사항:</strong> 운동 중 통증이 느껴지면 즉시 중단하세요. 넘어지지 않도록 주변 환경을 확인하고 안전하게 운동하세요.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
