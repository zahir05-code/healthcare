'use server';
/**
 * @fileOverview A flow for translating text between Korean and English.
 *
 * - translate - A function that handles the translation process.
 * - TranslateInput - The input type for the translate function.
 * - TranslateOutput - The return type for the translate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate between Korean and English.'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translate(input: TranslateInput): Promise<TranslateOutput> {
  return translateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {schema: TranslateInputSchema},
  output: {schema: TranslateOutputSchema},
  prompt: `You are a translator. Your task is to translate text between Korean and English.
First, detect the language of the input text.
If the text is in Korean, translate it to English.
If the text is in English, translate it to Korean.
Only return the translated text.

Input text: {{{text}}}`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
