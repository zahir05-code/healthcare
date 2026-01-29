'use client';

import {useState} from 'react';
import {Header} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {translate} from '@/ai/flows/translate-flow';
import {Loader} from 'lucide-react';

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setTranslatedText('');
    try {
      const result = await translate({text: inputText});
      setTranslatedText(result.translation);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText("죄송합니다. 번역 중 오류가 발생했습니다.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-2xl">
          <div className="grid gap-4">
            <Textarea
              placeholder="번역할 내용을 영어 또는 한글로 입력하세요..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] text-lg"
            />
            <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} size="lg">
              {isLoading ? <Loader className="animate-spin" /> : '한국어 <-> 영어 번역'}
            </Button>
            
            {isLoading && !translatedText && (
                <div className="flex justify-center items-center p-6">
                    <Loader className="animate-spin h-8 w-8 text-primary" />
                </div>
            )}
            
            {translatedText && (
              <Card>
                <CardHeader>
                  <CardTitle>번역 결과</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">{translatedText}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
