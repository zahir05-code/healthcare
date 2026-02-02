'use server';
/**
 * @fileOverview An AI flow to analyze a picture of a pill and identify its ingredients.
 *
 * - analyzePill - A function that handles the pill analysis process.
 * - AnalyzePillInput - The input type for the analyzePill function.
 * - AnalyzePillOutput - The return type for the analyzePill function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePillInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a pill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePillInput = z.infer<typeof AnalyzePillInputSchema>;

const AnalyzePillOutputSchema = z.object({
  isPill: z.boolean().describe('Whether a pill was identified in the image.'),
  pillName: z.string().describe('The common name of the identified pill. Empty if not a pill.'),
  ingredients: z.array(z.string()).describe('A list of active ingredients in the pill.'),
});
export type AnalyzePillOutput = z.infer<typeof AnalyzePillOutputSchema>;

export async function analyzePill(input: AnalyzePillInput): Promise<AnalyzePillOutput> {
  return analyzePillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePillPrompt',
  input: {schema: AnalyzePillInputSchema},
  output: {schema: AnalyzePillOutputSchema},
  prompt: `You are an expert pharmacist AI. Your task is to analyze the provided image of a pill.

1.  Identify the pill in the image. Look for markings, shape, and color.
2.  Determine the common brand name or generic name of the pill.
3.  List its primary active ingredients.
4.  If the image does not clearly show a pill, or if you cannot identify it, you must set 'isPill' to false.

Respond ONLY with a valid JSON object matching the output schema.

Image to analyze: {{media url=photoDataUri}}`,
});

const analyzePillFlow = ai.defineFlow(
  {
    name: 'analyzePillFlow',
    inputSchema: AnalyzePillInputSchema,
    outputSchema: AnalyzePillOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Pill analysis failed: The AI model did not return a valid output.");
    }
    return output;
  }
);
