'use server';

import { categorizeQrContent } from '@/ai/flows/categorize-qr-content';

export async function getCategory(content: string): Promise<string> {
  if (!content) {
    return "Empty";
  }
  try {
    const result = await categorizeQrContent({ content });
    return result.category;
  } catch (error) {
    console.error("Error categorizing content:", error);
    // Basic fallback categorization
    if (/^(https|http):\/\/[^\s$.?#].[^\s]*$/.test(content)) {
        return "URL";
    }
    return "Text";
  }
}
