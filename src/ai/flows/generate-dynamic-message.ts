'use server';

/**
 * @fileOverview An AI agent for generating dynamic content for canned messages based on clipboard content.
 *
 * - generateDynamicMessage - A function that generates dynamic content for a message.
 * - GenerateDynamicMessageInput - The input type for the generateDynamicMessage function.
 * - GenerateDynamicMessageOutput - The return type for the generateDynamicMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDynamicMessageInputSchema = z.object({
  messageBody: z.string().describe('The body of the canned message.'),
  clipboardContent: z.string().describe('The current content of the user\'s clipboard.'),
});
export type GenerateDynamicMessageInput = z.infer<typeof GenerateDynamicMessageInputSchema>;

const GenerateDynamicMessageOutputSchema = z.object({
  dynamicContent: z.string().describe('The dynamically generated content to be added to the message.'),
});
export type GenerateDynamicMessageOutput = z.infer<typeof GenerateDynamicMessageOutputSchema>;

export async function generateDynamicMessage(input: GenerateDynamicMessageInput): Promise<GenerateDynamicMessageOutput> {
  return generateDynamicMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDynamicMessagePrompt',
  input: {schema: GenerateDynamicMessageInputSchema},
  output: {schema: GenerateDynamicMessageOutputSchema},
  prompt: `You are a helpful assistant designed to generate dynamic content for canned messages.

  The user has a canned message and some content in their clipboard.
  Your goal is to create dynamic content that can be added to the canned message, using the clipboard content as context.
  Keep it brief and relevant.

  Canned Message:
  {{messageBody}}

  Clipboard Content:
  {{clipboardContent}}

  Dynamic Content:`,
});

const generateDynamicMessageFlow = ai.defineFlow(
  {
    name: 'generateDynamicMessageFlow',
    inputSchema: GenerateDynamicMessageInputSchema,
    outputSchema: GenerateDynamicMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {dynamicContent: output!.dynamicContent!};
  }
);
