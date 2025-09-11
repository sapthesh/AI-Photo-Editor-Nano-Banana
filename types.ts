/** @copyright sapthesh */
export interface ImageState {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

export enum AppState {
  INITIAL = 'INITIAL',
  CROPPING = 'CROPPING',
  IMAGE_CROPPED = 'IMAGE_CROPPED',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
}

export enum ImageEditModel {
  STANDARD = 'Standard',
  CREATIVE = 'Creative',
}

// FIX: The OutputMimeType is not supported for image editing with 'gemini-2.5-flash-image-preview', so the type definition has been removed.