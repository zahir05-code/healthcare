'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Pencil, Loader, BarChart } from 'lucide-react';
import Image from 'next/image';
import type { AnalyzeDietInput } from '@/ai/flows/analyze-diet-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Meal = 'breakfast' | 'lunch' | 'dinner';

interface MealData {
  image: string | null;
  note: string;
}

interface DietFormProps {
    onAnalyze: (data: AnalyzeDietInput) => void;
    isLoading: boolean;
}

export function DietForm({ onAnalyze, isLoading }: DietFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [meals, setMeals] = useState<Record<Meal, MealData>>({
    breakfast: { image: null, note: '' },
    lunch: { image: null, note: '' },
    dinner: { image: null, note: '' },
  });
  
  const [activeTab, setActiveTab] = useState<Meal>('breakfast');

  const breakfastPlaceholder = PlaceHolderImages.find(p => p.id === 'diet-breakfast');
  const lunchPlaceholder = PlaceHolderImages.find(p => p.id === 'diet-lunch');
  const dinnerPlaceholder = PlaceHolderImages.find(p => p.id === 'diet-dinner');

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

  const handleAnalyzeClick = () => {
    const analysisInput: AnalyzeDietInput = {
        breakfast: {
            note: meals.breakfast.note,
            photoDataUri: meals.breakfast.image || undefined,
        },
        lunch: {
            note: meals.lunch.note,
            photoDataUri: meals.lunch.image || undefined,
        },
        dinner: {
            note: meals.dinner.note,
            photoDataUri: meals.dinner.image || undefined,
        }
    };
    onAnalyze(analysisInput);
  };

  const renderMealTab = (meal: Meal, title: string, placeholderImage?: string, imageHint?: string) => {
    const mealData = meals[meal];
    
    return (
      <TabsContent value={meal} key={meal}>
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>사진을 찍거나 글로 식단을 기록하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                <Image
                    src={mealData.image || placeholderImage || "https://picsum.photos/600/400"}
                    alt={`${title} 식사`}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint}
                />
            </div>

            <Button onClick={handleTakePhotoClick} className="w-full" variant="outline">
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
          </CardContent>
        </Card>
      </TabsContent>
    );
  };
  
  return (
    <div className="w-full max-w-2xl">
        <Tabs 
            defaultValue="breakfast" 
            className="w-full"
            onValueChange={(value) => setActiveTab(value as Meal)}
        >
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="breakfast">아침</TabsTrigger>
                <TabsTrigger value="lunch">점심</TabsTrigger>
                <TabsTrigger value="dinner">저녁</TabsTrigger>
            </TabsList>
            
            {renderMealTab('breakfast', '아침', breakfastPlaceholder?.imageUrl, breakfastPlaceholder?.imageHint)}
            {renderMealTab('lunch', '점심', lunchPlaceholder?.imageUrl, lunchPlaceholder?.imageHint)}
            {renderMealTab('dinner', '저녁', dinnerPlaceholder?.imageUrl, dinnerPlaceholder?.imageHint)}
        </Tabs>
        <div className="mt-6">
            <Button onClick={handleAnalyzeClick} className="w-full h-14 text-lg" disabled={isLoading}>
                {isLoading ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <BarChart className="mr-2 h-5 w-5" />}
                오늘 식단 분석하기
            </Button>
        </div>
    </div>
  );
}
