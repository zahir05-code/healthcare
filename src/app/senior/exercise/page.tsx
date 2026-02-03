'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const exercises = [
  {
    id: 'lower-body',
    title: '앉아서 하는 하체 운동 (10분)',
    bodyPart: '하체',
    description: '의자에 앉아 안전하게 다리 근력을 키울 수 있는 운동입니다.',
    videoId: 'wP3b-x0K-sI',
    details: [
      '무릎 펴기',
      '다리 들어올리기',
      '발목 움직이기',
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
    description: '층간 소음 걱정 없이 서서 할 수 있는 가벼운 전신 유산소 운동입니다.',
    videoId: '9L2b2zso1pA',
    details: [
        '제자리 걷기',
        '가볍게 팔다리 움직이기',
        '옆으로 걸음 옮기기',
        '다양한 저충격 유산소 동작'
    ],
  },
  {
    id: 'stretching',
    title: '의자 스트레칭 (12분)',
    bodyPart: '스트레칭',
    description: '의자에 앉아서 목, 어깨, 등, 다리 등 전신을 시원하게 풀어주는 스트레칭입니다.',
    videoId: 'Egr_kY_n4jI',
    details: [
        '목 스트레칭',
        '어깨와 등 풀기',
        '허리 비틀기',
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
