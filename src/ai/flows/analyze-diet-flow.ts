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
  prompt: `당신은 한국 어르신들을 위한 영양 관리 전문 AI입니다. 제공된 아침, 점심, 저녁 식사 기록(글과 사진)을 분석해 주세요.

**분석 지침:**
1.  식사 기록에서 모든 음식 항목을 확인합니다.
2.  6가지 식품군('곡물', '단백질', '채소', '과일', '유제품', '지방') 각각의 섭취량을 추정합니다.
3.  각 식품군 섭취량이 어르신 건강 기준에 따라 '부족', '적정', '과다' 중 어디에 해당하는지 판단해야 합니다.
4.  각 식품군에 대해 실천하기 쉬운 한 문장의 조언을 한국어로 작성합니다.
5.  하루 식단에 대한 전반적인 평가와 격려를 담아 2-3 문장의 쉬운 요약(summary)을 한국어 존댓말로 작성합니다.
6.  응답은 반드시 아래에 명시된 출력 스키마(output schema)에 맞는 JSON 형식이어야 합니다. 다른 설명 없이 JSON 객체만 반환해 주세요.

**식단 기록:**

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
