/** @copyright sapthesh */
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageCropper } from './components/ImageCropper';
import { EditControls } from './components/EditControls';
import { ImageViewer } from './components/ImageViewer';
import { Footer } from './components/Footer';
import { editImageWithGemini } from './services/geminiService';
import type { ImageState, HistoryEntry } from './types';
import { AppState, ImageEditModel, FilterType } from './types';

const App: React.FC = () => {
  const initialHistory: HistoryEntry = {
    prompt: '',
    uncroppedImage: null,
    originalImage: null,
    editedImage: null,
    apiResponseText: '',
    appState: AppState.INITIAL,
    error: null,
    model: ImageEditModel.STANDARD,
    editIntensity: 100,
    filter: FilterType.NONE,
  };
  
  const [history, setHistory] = useState<HistoryEntry[]>([initialHistory]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const currentState = history[historyIndex];
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const updateHistory = (newState: Partial<HistoryEntry>) => {
    const newHistoryEntry = { ...currentState, ...newState };
    // When a new action is taken, clear the "redo" history
    const newHistory = [...history.slice(0, historyIndex + 1), newHistoryEntry];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const handleUndo = () => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();

    reader.onloadstart = () => setUploadProgress(0);
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    reader.onloadend = () => {
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 500);
      const base64String = reader.result as string;
      updateHistory({
        ...initialHistory, // Reset to a clean state
        uncroppedImage: {
          base64: base64String.split(',')[1],
          mimeType: file.type,
          dataUrl: base64String,
        },
        appState: AppState.CROPPING,
      });
    };
    reader.onerror = () => {
      setUploadProgress(null);
      updateHistory({
        error: 'File reading failed. The file might be corrupted or in an unsupported format.',
        appState: AppState.ERROR,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = (croppedImage: ImageState) => {
    updateHistory({
      uncroppedImage: null,
      originalImage: croppedImage,
      appState: AppState.IMAGE_CROPPED,
    });
  };

  const handleCropCancel = () => {
    handleReset();
  };

  const handleEditRequest = useCallback(async () => {
    if (!currentState.originalImage || !currentState.prompt.trim()) {
      updateHistory({ error: 'Please upload an image and enter an edit description.', appState: AppState.ERROR });
      return;
    }

    updateHistory({
      appState: AppState.LOADING,
      editedImage: null,
      apiResponseText: '',
      error: null,
      editIntensity: 100,
    });

    try {
      const result = await editImageWithGemini(
        currentState.originalImage.base64,
        currentState.originalImage.mimeType,
        currentState.prompt,
        currentState.model
      );
      
      if (result.editedImage) {
        updateHistory({
          editedImage: result.editedImage,
          apiResponseText: result.textResponse || 'Edit successful!',
          appState: AppState.RESULT,
        });
      } else {
        updateHistory({
          error: result.textResponse || 'The model did not return an image. Please try a different prompt.',
          appState: AppState.ERROR,
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      updateHistory({
        error: `Failed to edit image: ${errorMessage}`,
        appState: AppState.ERROR,
      });
    }
  }, [currentState.originalImage, currentState.prompt, currentState.model, history, historyIndex]);
  
  const handleReset = () => {
      setHistory([initialHistory]);
      setHistoryIndex(0);
  }

  const handleContinueEditing = () => {
    if (!currentState.editedImage) return;
    updateHistory({
      originalImage: currentState.editedImage,
      editedImage: null,
      prompt: '',
      apiResponseText: '',
      appState: AppState.IMAGE_CROPPED,
      editIntensity: 100,
      filter: FilterType.NONE, // Reset filter for new edit cycle
    });
  };

  const handleFilterChange = (filter: FilterType) => {
    updateHistory({ filter });
  };

  const getFilterStyle = (filter: FilterType): React.CSSProperties => {
    let filterValue = 'none';
    switch (filter) {
      case FilterType.VINTAGE:
        filterValue = 'sepia(0.6) contrast(0.8) brightness(1.1) saturate(1.2)';
        break;
      case FilterType.POLAROID:
        filterValue = 'sepia(0.4) contrast(1.2) brightness(1.1) saturate(1.3)';
        break;
      case FilterType.BLACK_WHITE:
        filterValue = 'grayscale(1)';
        break;
      case FilterType.SEPIA:
        filterValue = 'sepia(1)';
        break;
      case FilterType.NEGATIVE:
        filterValue = 'invert(1)';
        break;
      default:
        filterValue = 'none';
        break;
    }
    return { filter: filterValue };
  };

  const renderContent = () => {
    const { appState, uncroppedImage, originalImage, editedImage, error, apiResponseText, prompt, model, editIntensity, filter } = currentState;
    
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
                  <img 
                    src={originalImage.dataUrl} 
                    alt="Original" 
                    className="w-full h-full object-contain transition-all duration-300"
                    style={getFilterStyle(filter)}
                  />
              </div>
          </div>

          {/* Right Column: Controls and Result */}
          <div className="flex flex-col gap-8">
              <EditControls
                  prompt={prompt}
                  setPrompt={(p) => updateHistory({ ...currentState, prompt: p })}
                  onSubmit={handleEditRequest}
                  onReset={handleReset}
                  isLoading={appState === AppState.LOADING}
                  model={model}
                  setModel={(m) => updateHistory({ ...currentState, model: m })}
                  filter={filter}
                  onFilterChange={handleFilterChange}
              />
              <ImageViewer
                  originalImage={originalImage}
                  editedImage={editedImage}
                  appState={appState}
                  error={error}
                  editIntensity={editIntensity}
                  onIntensityChange={(i) => updateHistory({ ...currentState, editIntensity: i })}
                  onContinueEditing={handleContinueEditing}
                  filter={filter}
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
      <Header onUndo={handleUndo} onRedo={handleRedo} canUndo={canUndo} canRedo={canRedo} />
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