'use client';

import {useState} from 'react';
import {Header} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {translate} from '@/ai/flows/translate-flow';
import {Loader} from 'lucide-react';

export default function TranslatePage() {
  const [direction, setDirection] = useState<'ko-en' | 'en-ko'>('ko-en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sourceLanguage = direction === 'ko-en' ? 'Korean' : 'English';
  const targetLanguage = direction === 'ko-en' ? 'English' : 'Korean';

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setTranslatedText('');
    try {
      const result = await translate({text: inputText, sourceLanguage, targetLanguage});
      setTranslatedText(result.translation);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('죄송합니다. 번역 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  const handleDirectionChange = (newDirection: 'ko-en' | 'en-ko') => {
    if (direction === newDirection) return;
    setDirection(newDirection);
    setInputText(translatedText);
    setTranslatedText('');
  }

  const pageTitle = direction === 'ko-en' ? '한글을 영어로 번역' : '영어를 한글로 번역';
  const placeholderText = direction === 'ko-en' ? '번역할 한글 텍스트를 입력하세요...' : 'Enter English text to translate...';

  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-center">
              {pageTitle}
            </h1>
            <div className="flex justify-center gap-2">
                <Button
                    variant={direction === 'ko-en' ? 'default' : 'outline'}
                    onClick={() => handleDirectionChange('ko-en')}
                >
                    한글 → 영어
                </Button>
                <Button
                    variant={direction === 'en-ko' ? 'default' : 'outline'}
                    onClick={() => handleDirectionChange('en-ko')}
                >
                    영어 → 한글
                </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Textarea
              placeholder={placeholderText}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] text-lg"
            />
            <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} size="lg">
              {isLoading ? <Loader className="animate-spin" /> : '번역하기'}
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
