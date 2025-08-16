'use server';
/**
 * @fileOverview An AI agent to categorize QR code content.
 *
 * - categorizeQrContent - A function that categorizes the content extracted from a QR code.
 * - CategorizeQrContentInput - The input type for the categorizeQrContent function.
 * - CategorizeQrContentOutput - The return type for the categorizeQrContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeQrContentInputSchema = z.object({
  content: z.string().describe('The content extracted from the QR code.'),
});
export type CategorizeQrContentInput = z.infer<typeof CategorizeQrContentInputSchema>;

const CategorizeQrContentOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the QR code content (e.g., URL, text, contact info).'
    ),
});
export type CategorizeQrContentOutput = z.infer<typeof CategorizeQrContentOutputSchema>;

export async function categorizeQrContent(
  input: CategorizeQrContentInput
): Promise<CategorizeQrContentOutput> {
  return categorizeQrContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeQrContentPrompt',
  input: {schema: CategorizeQrContentInputSchema},
  output: {schema: CategorizeQrContentOutputSchema},
  prompt: `You are an expert in content categorization. Analyze the content provided and determine its category. Categories could include URL, plain text, contact information, event details, or other relevant classifications.

Content: {{{content}}}

Category:`,
});

const categorizeQrContentFlow = ai.defineFlow(
  {
    name: 'categorizeQrContentFlow',
    inputSchema: CategorizeQrContentInputSchema,
    outputSchema: CategorizeQrContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
