'use server';
/**
 * @fileOverview A flow for translating text between languages.
 *
 * - translate - A function that handles the translation process.
 * - TranslateInput - The input type for the translate function.
 * - TranslateOutput - The return type for the translate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.string().describe('The source language (e.g., "Korean").'),
  targetLanguage: z.string().describe('The target language (e.g., "English").'),
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
  prompt: `Translate the following {{{sourceLanguage}}} text to {{{targetLanguage}}}: {{{text}}}`,
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
