'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Loader, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type Meal = 'breakfast' | 'lunch' | 'dinner';

interface MealData {
  image: string | null;
  note: string;
}

export function DietForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [meals, setMeals] = useState<Record<Meal, MealData>>({
    breakfast: { image: null, note: '' },
    lunch: { image: null, note: '' },
    dinner: { image: null, note: '' },
  });
  
  const [activeTab, setActiveTab] = useState<Meal>('breakfast');
  const [isLoading, setIsLoading] = useState(false);

  const handleNoteChange = (meal: Meal, note: string) => {
    setMeals(prev => ({
      ...prev,
      [meal]: { ...prev[meal], note },
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setMeals(prev => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], image: e.target?.result as string },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = (meal: Meal) => {
    setIsLoading(true);
    // Simulate saving data
    console.log(`Saving ${meal} data:`, meals[meal]);
    setTimeout(() => {
      toast({
        title: `${meal === 'breakfast' ? '아침' : meal === 'lunch' ? '점심' : '저녁'} 식단 저장됨`,
        description: '식단이 성공적으로 기록되었습니다.',
      });
      setIsLoading(false);
    }, 1000);
  };

  const renderMealTab = (meal: Meal, title: string, placeholderImage: string, imageHint: string) => {
    const mealData = meals[meal];
    
    return (
      <TabsContent value={meal} key={meal}>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>사진을 찍거나 글로 식단을 기록하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                <Image
                    src={mealData.image || placeholderImage}
                    alt={`${title} 식사`}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint}
                />
            </div>

            <Button onClick={handleTakePhotoClick} className="w-full">
                <Camera className="mr-2" /> {mealData.image ? '사진 다시 찍기' : '사진 찍어 기록하기'}
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                capture="environment"
            />

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                <Pencil className="mr-2 h-4 w-4" />
                수기로 기록하기
              </label>
              <Textarea
                placeholder={`${title} 식단으로 무엇을 드셨나요? (예: 쌀밥, 미역국, 계란찜)`}
                value={mealData.note}
                onChange={(e) => handleNoteChange(meal, e.target.value)}
                rows={4}
              />
            </div>
            
            <Button onClick={() => handleSave(meal)} className="w-full" disabled={isLoading}>
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : `${title} 식단 저장`}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    );
  };
  
  return (
    <Tabs 
        defaultValue="breakfast" 
        className="w-full max-w-2xl"
        onValueChange={(value) => setActiveTab(value as Meal)}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="breakfast">아침</TabsTrigger>
        <TabsTrigger value="lunch">점심</TabsTrigger>
        <TabsTrigger value="dinner">저녁</TabsTrigger>
      </TabsList>
      
      {renderMealTab('breakfast', '아침', 'https://picsum.photos/seed/breakfast1/600/400', 'healthy breakfast')}
      {renderMealTab('lunch', '점심', 'https://picsum.photos/seed/lunch1/600/400', 'healthy lunch')}
      {renderMealTab('dinner', '저녁', 'https://picsum.photos/seed/dinner1/600/400', 'healthy dinner')}
    </Tabs>
  );
}
