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

export enum FilterType {
  NONE = 'None',
  VINTAGE = 'Vintage',
  POLAROID = 'Polaroid',
  BLACK_WHITE = 'B & W',
  SEPIA = 'Sepia',
  NEGATIVE = 'Negative',
}

export interface HistoryEntry {
  prompt: string;
  uncroppedImage: ImageState | null;
  originalImage: ImageState | null;
  editedImage: ImageState | null;
  apiResponseText: string;
  appState: AppState;
  error: string | null;
  model: ImageEditModel;
  editIntensity: number;
  filter: FilterType;
}