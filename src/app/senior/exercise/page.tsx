'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const exercises = [
  {
    id: 'daily-balance',
    title: '서울아산병원: 낙상 예방 균형 운동',
    bodyPart: '매일운동',
    description: '매일매일 꾸준히 하여 균형 감각을 키우고 낙상을 예방하는 필수 동영상입니다.',
    videoId: 'cOrigY7UDDc',
    details: [
      '제자리에서 중심 잡기',
      '한 발 들고 버티기',
      '좌우로 몸 넘기며 균형 잡기',
    ],
  },
  {
    id: 'lower-body',
    title: '서울아산병원: 하체 근력 강화 운동',
    bodyPart: '하체',
    description: '튼튼한 다리를 위해 하체 근육을 집중적으로 강화하는 전문 운동입니다.',
    videoId: 'VGjc4mach_U',
    details: [
      '앉았다 일어나기 스쿼트',
      '다리 옆으로 들어 올리기',
      '발끝 밀어 올리기',
    ],
  },
  {
    id: 'upper-body',
    title: '서울아산병원: 상체 근력 강화 운동',
    bodyPart: '상체',
    description: '팔, 어깨, 가슴 근육을 골고루 강화하여 상체의 힘을 기르는 운동입니다.',
    videoId: 'pv5r1Ffu1Rk',
    details: [
      '팔 굽혀 펴기 (의자 활용)',
      '어깨 위로 팔 들어 올리기',
      '가슴 앞에서 손바닥 밀기',
    ],
  },
  {
    id: 'full-body',
    title: '서울아산병원: 전신 근력 강화 운동',
    bodyPart: '전신',
    description: '몸 전체의 근육을 조화롭게 발달시키는 종합 근력 강화 프로그램입니다.',
    videoId: 'pCyT7MWC_H4',
    details: [
      '전신 기지개 켜기',
      '팔다리 교차하여 움직이기',
      '숨 고르며 온몸 근육 수축하기',
    ],
  },
  {
    id: 'stretching',
    title: '서울아산병원: 전신 스트레칭',
    bodyPart: '스트레칭',
    description: '유연성을 높이고 근육의 피로를 풀어주는 부드러운 전신 스트레칭입니다.',
    videoId: 'aSPIO3zGiDU',
    details: [
      '목과 어깨 천천히 돌리기',
      '옆구리 시원하게 늘리기',
      '전신 쭉쭉 뻗어주기',
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
          <TabsList className="grid w-full grid-cols-5">
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

                  {/* 유튜브 직접 연결 버튼 추가 */}
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={`https://www.youtube.com/watch?v=${exercise.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-xl rounded-xl shadow-md">
                        <span className="mr-2">▶</span> 유튜브에서 직접 크게 보기
                      </Button>
                    </a>
                    <p className="text-center text-sm text-muted-foreground font-medium">
                      ※ 화면이 나오지 않거나 재생되지 않으면 위 빨간 버튼을 눌러주세요.
                    </p>
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
