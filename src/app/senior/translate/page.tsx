'use client';

import {useState} from 'react';
import {Header} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {translate} from '@/ai/flows/translate-flow';
import {Loader, Languages} from 'lucide-react';

const content = {
    ko: {
        koToEnTitle: "한글을 영어로 번역",
        enToKoTitle: "영어를 한글로 번역",
        koToEn: "한글 → 영어",
        enToKo: "영어 → 한글",
        koPlaceholder: "번역할 한글 텍스트를 입력하세요...",
        enPlaceholder: "번역할 영어 텍스트를 입력하세요...",
        translateButton: "번역하기",
        resultTitle: "번역 결과",
        error: "죄송합니다. 번역 중 오류가 발생했습니다.",
        toggleLang: "Switch to English"
    },
    en: {
        koToEnTitle: "Translate Korean to English",
        enToKoTitle: "Translate English to Korean",
        koToEn: "Korean → English",
        enToKo: "English → Korean",
        koPlaceholder: "Enter Korean text to translate...",
        enPlaceholder: "Enter English text to translate...",
        translateButton: "Translate",
        resultTitle: "Translation Result",
        error: "Sorry, an error occurred during translation.",
        toggleLang: "한국어로 보기"
    }
}

export default function TranslatePage() {
  const [direction, setDirection] = useState<'ko-en' | 'en-ko'>('ko-en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uiLang, setUiLang] = useState<'ko' | 'en'>('ko');

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
      setTranslatedText(content[uiLang].error);
    }
    setIsLoading(false);
  };

  const handleDirectionChange = (newDirection: 'ko-en' | 'en-ko') => {
    if (direction === newDirection) return;
    setDirection(newDirection);
    setInputText(translatedText);
    setTranslatedText('');
  }

  const toggleUiLang = () => {
    setUiLang(prev => prev === 'ko' ? 'en' : 'ko');
  }

  const pageTitle = direction === 'ko-en' ? content[uiLang].koToEnTitle : content[uiLang].enToKoTitle;
  const placeholderText = direction === 'ko-en' ? content[uiLang].koPlaceholder : content[uiLang].enPlaceholder;

  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-2xl">
            <div className="flex flex-col items-center mb-6 gap-4">
                <div className="w-full flex justify-center items-center relative">
                    <h1 className="text-3xl font-bold text-center">
                    {pageTitle}
                    </h1>
                    <div className="absolute right-0">
                        <Button variant="ghost" onClick={toggleUiLang}>
                            <Languages className="mr-2 h-4 w-4" />
                            {content[uiLang].toggleLang}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center gap-2">
                    <Button
                        variant={direction === 'ko-en' ? 'default' : 'outline'}
                        onClick={() => handleDirectionChange('ko-en')}
                    >
                        {content[uiLang].koToEn}
                    </Button>
                    <Button
                        variant={direction === 'en-ko' ? 'default' : 'outline'}
                        onClick={() => handleDirectionChange('en-ko')}
                    >
                        {content[uiLang].enToKo}
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
              {isLoading ? <Loader className="animate-spin" /> : content[uiLang].translateButton}
            </Button>
            
            {isLoading && !translatedText && (
                <div className="flex justify-center items-center p-6">
                    <Loader className="animate-spin h-8 w-8 text-primary" />
                </div>
            )}
            
            {translatedText && (
              <Card>
                <CardHeader>
                  <CardTitle>{content[uiLang].resultTitle}</CardTitle>
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
