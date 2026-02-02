'use server';
/**
 * @fileOverview A flow for translating text between Korean and English.
 *
 * - translateToKorean - A function that translates text to Korean.
 * - translateToEnglish - A function that translates text to English.
 * - TranslateOutput - The return type for the translation functions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateFlowInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.enum(['Korean', 'English']).describe('The language to translate the text into.'),
});

const TranslateOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;


const prompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {schema: TranslateFlowInputSchema},
  output: {schema: TranslateOutputSchema},
  prompt: `You are an expert translator. Your task is to translate the given text into {{targetLanguage}}.

Your final output must be a JSON object with a single key "translation" which contains the translated text. Do not include any other text or explanation.

Input text: {{{text}}}`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateFlowInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("번역에 실패했습니다: AI 모델이 유효한 출력을 반환하지 않았습니다.");
    }
    return output;
  }
);

export async function translateToKorean(input: { text: string }): Promise<TranslateOutput> {
  return translateFlow({ ...input, targetLanguage: 'Korean' });
}

export async function translateToEnglish(input: { text: string }): Promise<TranslateOutput> {
  return translateFlow({ ...input, targetLanguage: 'English' });
}
