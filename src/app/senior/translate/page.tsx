'use client';

import {useState} from 'react';
import {Header} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {translate} from '@/ai/flows/translate-flow';
import {Loader, ArrowRightLeft} from 'lucide-react';

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
      setTranslatedText('Sorry, something went wrong during translation.');
    }
    setIsLoading(false);
  };

  const handleSwap = () => {
    setDirection(d => d === 'ko-en' ? 'en-ko' : 'ko-en');
    setInputText(translatedText);
    setTranslatedText(inputText);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
            <h1 className="text-3xl font-bold text-center sm:text-left">
              {sourceLanguage} to {targetLanguage} Translation
            </h1>
            <Button variant="outline" onClick={handleSwap}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Swap Languages
            </Button>
          </div>
          <div className="grid gap-4">
            <Textarea
              placeholder={`Enter ${sourceLanguage} text here...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] text-lg"
            />
            <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} size="lg">
              {isLoading ? <Loader className="animate-spin" /> : 'Translate'}
            </Button>
            
            {isLoading && !translatedText && (
                <div className="flex justify-center items-center p-6">
                    <Loader className="animate-spin h-8 w-8 text-primary" />
                </div>
            )}
            
            {translatedText && (
              <Card>
                <CardHeader>
                  <CardTitle>Translation</CardTitle>
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
