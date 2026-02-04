'use server';
/**
 * @fileOverview A conversational chatbot flow.
 *
 * - chat - A function that handles the conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
  })).describe("The conversation history."),
  message: z.string().describe('The user\'s new message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const systemPrompt = `You are a friendly and helpful AI assistant for a senior user. Your name is 케어봇 (CareBot).
You are part of the 헬스케어 (Healthcare) application.
Your goal is to provide helpful information, answer questions, and have pleasant conversations.
Keep your answers concise, clear, and easy to understand.
Always speak in polite Korean (존댓말).
You can provide information about health, daily schedules, or just chat about everyday topics.
If you don't know an answer, say you don't know, but you can try to help find it.`;


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, message }) => {
    
    const messages = history.map(h => ({
        role: h.role,
        content: [{ text: h.content }]
    }));

    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: {
            system: systemPrompt,
            messages: [
                ...messages,
                { role: 'user', content: [{ text: message }] }
            ]
        },
    });

    return { response: response.text };
  }
);
