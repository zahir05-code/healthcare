'use server';
/**
 * @fileOverview An AI flow to analyze a day's meals and provide nutritional feedback.
 *
 * - analyzeDiet - A function that handles the diet analysis process.
 * - AnalyzeDietInput - The input type for the analyzeDiet function.
 * - AnalyzeDietOutput - The return type for the analyzeDiet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MealInputSchema = z.object({
  note: z.string().describe('A text description of the meal.'),
  photoDataUri: z.string().optional().describe(
      "A photo of the meal, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const AnalyzeDietInputSchema = z.object({
  breakfast: MealInputSchema,
  lunch: MealInputSchema,
  dinner: MealInputSchema,
});
export type AnalyzeDietInput = z.infer<typeof AnalyzeDietInputSchema>;

const NutritionalAnalysisSchema = z.object({
    group: z.enum(['곡물', '단백질', '채소', '과일', '유제품', '지방']),
    status: z.enum(['부족', '적정', '과다']),
    recommendation: z.string().describe('A short recommendation for this food group in Korean.'),
});

const AnalyzeDietOutputSchema = z.object({
  summary: z.string().describe("A brief, easy-to-understand summary of the day's diet in Korean (존댓말)."),
  analysis: z.array(NutritionalAnalysisSchema),
});
export type AnalyzeDietOutput = z.infer<typeof AnalyzeDietOutputSchema>;

export async function analyzeDiet(input: AnalyzeDietInput): Promise<AnalyzeDietOutput> {
  return analyzeDietFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDietPrompt',
  input: {schema: AnalyzeDietInputSchema},
  output: {schema: AnalyzeDietOutputSchema},
  prompt: `You are an expert nutritionist AI specializing in senior healthcare. Your user is an elderly person in Korea.
Analyze the user's meals for the entire day (breakfast, lunch, and dinner) based on the provided text descriptions and images.

Your task is to:
1.  Identify all the food items from the meals.
2.  Estimate the daily intake for the following 6 essential food groups for seniors: 곡물(Grains), 단백질(Protein), 채소(Vegetables), 과일(Fruits), 유제품(Dairy), 지방(Fats).
3.  For each food group, determine if the intake is 부족 (insufficient), 적정 (appropriate), or 과다 (excessive) based on general dietary guidelines for seniors.
4.  Provide a short, simple, one-sentence recommendation for each food group.
5.  Write a brief, encouraging, and easy-to-understand overall summary (2-3 sentences) of the day's diet.
6.  Always use polite Korean (존댓말).
7.  Respond ONLY with a valid JSON object matching the output schema.

Here is the meal data:

**아침 식사:**
- 글: {{{breakfast.note}}}
{{#if breakfast.photoDataUri}}
- 사진: {{media url=breakfast.photoDataUri}}
{{/if}}

**점심 식사:**
- 글: {{{lunch.note}}}
{{#if lunch.photoDataUri}}
- 사진: {{media url=lunch.photoDataUri}}
{{/if}}

**저녁 식사:**
- 글: {{{dinner.note}}}
{{#if dinner.photoDataUri}}
- 사진: {{media url=dinner.photoDataUri}}
{{/if}}
`,
});

const analyzeDietFlow = ai.defineFlow(
  {
    name: 'analyzeDietFlow',
    inputSchema: AnalyzeDietInputSchema,
    outputSchema: AnalyzeDietOutputSchema,
  },
  async input => {
    // Ensure at least one meal has some data
    if (!input.breakfast.note && !input.breakfast.photoDataUri &&
        !input.lunch.note && !input.lunch.photoDataUri &&
        !input.dinner.note && !input.dinner.photoDataUri) {
          return {
            summary: "기록된 식단이 없습니다. 아침, 점심, 저녁 식사를 기록하고 분석 버튼을 눌러주세요.",
            analysis: [],
          };
    }

    const {output} = await prompt(input);
    if (!output) {
      throw new Error("식단 분석에 실패했습니다: AI 모델이 유효한 출력을 반환하지 않았습니다.");
    }
    return output;
  }
);
