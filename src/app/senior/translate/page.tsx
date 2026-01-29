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
      setTranslatedText('Sorry, something went wrong during translation.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header backHref="/senior" />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Korean to English Translation</h1>
          <div className="grid gap-4">
            <Textarea
              placeholder="Enter Korean text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] text-lg"
            />
            <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} size="lg">
              {isLoading ? <Loader className="animate-spin" /> : 'Translate'}
            </Button>
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
             {isLoading && !translatedText && (
                <div className="flex justify-center items-center p-6">
                    <Loader className="animate-spin h-8 w-8 text-primary" />
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
