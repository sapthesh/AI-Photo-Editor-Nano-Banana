/** @copyright sapthesh */
import { GoogleGenAI, Modality } from '@google/genai';
// FIX: Removed unused OutputMimeType import.
import type { ImageState } from '../types';
import { ImageEditModel } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

interface EditResult {
  editedImage: ImageState | null;
  textResponse: string | null;
}

// FIX: The 'gemini-2.5-flash-image-preview' model does not support the `outputMimeType` parameter.
// The parameter has been removed from the function signature and the `generateContent` API call.
export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string,
  modelId: ImageEditModel
): Promise<EditResult> => {
  try {
    const apiModel = 'gemini-2.5-flash-image-preview';
    let finalPrompt = prompt;

    // Simulate a different model "style" by modifying the prompt
    if (modelId === ImageEditModel.CREATIVE) {
      finalPrompt = `In a highly creative, artistic, and dramatic style, ${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: apiModel,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let editedImage: ImageState | null = null;
    let textResponse: string | null = null;

    // The response is guaranteed to have candidates if the request is successful.
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        textResponse = (textResponse || '') + part.text + ' ';
      } else if (part.inlineData) {
        const { data, mimeType: newMimeType } = part.inlineData;
        editedImage = {
          base64: data,
          mimeType: newMimeType,
          dataUrl: `data:${newMimeType};base64,${data}`,
        };
      }
    }

    return { 
        editedImage, 
        textResponse: textResponse?.trim() || null 
    };

  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error(
      error instanceof Error ? error.message : 'An unexpected error occurred during the API call.'
    );
  }
};