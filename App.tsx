/** @copyright sapthesh */
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageCropper } from './components/ImageCropper';
import { EditControls } from './components/EditControls';
import { ImageViewer } from './components/ImageViewer';
import { Footer } from './components/Footer';
import { editImageWithGemini } from './services/geminiService';
import type { ImageState } from './types';
import { AppState, ImageEditModel } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [uncroppedImage, setUncroppedImage] = useState<ImageState | null>(null);
  const [originalImage, setOriginalImage] = useState<ImageState | null>(null);
  const [editedImage, setEditedImage] = useState<ImageState | null>(null);
  const [apiResponseText, setApiResponseText] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<ImageEditModel>(ImageEditModel.STANDARD);
  const [editIntensity, setEditIntensity] = useState<number>(100);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleImageUpload = (file: File) => {
    // Clear previous errors on a new upload attempt
    setError(null);
    const reader = new FileReader();

    reader.onloadstart = () => {
      setUploadProgress(0);
    };
    
    reader.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentage);
        }
    };

    reader.onloadend = () => {
      // Ensure the progress bar visually completes before disappearing
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 500);

      const base64String = reader.result as string;
      setUncroppedImage({
        base64: base64String.split(',')[1],
        mimeType: file.type,
        dataUrl: base64String,
      });
      setOriginalImage(null);
      setEditedImage(null);
      setApiResponseText('');
      setAppState(AppState.CROPPING);
      setEditIntensity(100);
    };

    reader.onerror = () => {
      setError('File reading failed. The file might be corrupted or in an unsupported format.');
      setAppState(AppState.ERROR);
      setUploadProgress(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = (croppedImage: ImageState) => {
    setOriginalImage(croppedImage);
    setUncroppedImage(null);
    setAppState(AppState.IMAGE_CROPPED);
  };

  const handleCropCancel = () => {
    handleReset();
  };

  const handleEditRequest = useCallback(async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Please upload an image and enter an edit description.');
      setAppState(AppState.ERROR);
      return;
    }

    setAppState(AppState.LOADING);
    setEditedImage(null);
    setApiResponseText('');
    setError(null);
    setEditIntensity(100);

    try {
      const result = await editImageWithGemini(
        originalImage.base64,
        originalImage.mimeType,
        prompt,
        model
      );
      
      if (result.editedImage) {
        setEditedImage(result.editedImage);
        setApiResponseText(result.textResponse || 'Edit successful!');
        setAppState(AppState.RESULT);
      } else {
        setError(result.textResponse || 'The model did not return an image. Please try a different prompt.');
        setAppState(AppState.ERROR);
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to edit image: ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, [originalImage, prompt, model]);
  
  const handleReset = () => {
      setUncroppedImage(null);
      setOriginalImage(null);
      setEditedImage(null);
      setPrompt('');
      setError(null);
      setApiResponseText('');
      setAppState(AppState.INITIAL);
      setEditIntensity(100);
  }

  const handleContinueEditing = () => {
    if (!editedImage) return;

    // The edited image becomes the new original
    setOriginalImage(editedImage);
  
    // Reset the rest of the state for the next edit
    setEditedImage(null);
    setPrompt('');
    setApiResponseText('');
    setAppState(AppState.IMAGE_CROPPED);
    setEditIntensity(100);
  };

  const renderContent = () => {
    if (appState === AppState.CROPPING && uncroppedImage) {
      return <ImageCropper image={uncroppedImage} onConfirm={handleCropConfirm} onCancel={handleCropCancel} />;
    }

    if (originalImage) {
      return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Original Image */}
          <div className="w-full flex flex-col md:sticky top-8">
              <h3 className="text-lg font-medium text-center mb-3 text-[#E2E2E9]">Original</h3>
              <div className="aspect-square w-full bg-[#111318] rounded-xl overflow-hidden flex items-center justify-center relative border border-[#8C919A]/50">
                  <img src={originalImage.dataUrl} alt="Original" className="w-full h-full object-contain" />
              </div>
          </div>

          {/* Right Column: Controls and Result */}
          <div className="flex flex-col gap-8">
              <EditControls
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onSubmit={handleEditRequest}
                  onReset={handleReset}
                  isLoading={appState === AppState.LOADING}
                  model={model}
                  setModel={setModel}
              />
              <ImageViewer
                  originalImage={originalImage.dataUrl}
                  editedImage={editedImage}
                  appState={appState}
                  error={error}
                  editIntensity={editIntensity}
                  onIntensityChange={setEditIntensity}
                  onContinueEditing={handleContinueEditing}
              />
              {apiResponseText && (appState === AppState.RESULT || appState === AppState.ERROR && !error) && (
                  <div className="p-4 bg-[#111318] border border-[#8C919A]/50 rounded-lg">
                      <p className="text-[#E2E2E9] italic"><span className="font-bold not-italic text-[#A3C9FF]">AI says:</span> "{apiResponseText}"</p>
                  </div>
              )}
          </div>
        </div>
      );
    }

    return (
      <ImageUploader 
        onImageUpload={handleImageUpload} 
        uploadProgress={uploadProgress} 
        error={error} 
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111318] text-[#E2E2E9]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-[#1D2025] border border-[#8C919A]/30 rounded-2xl shadow-2xl shadow-black/30 p-4 sm:p-6 md:p-8 flex flex-col gap-8">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;