/** @copyright sapthesh */
import React, { useRef, useEffect } from 'react';
import { AppState, ImageState, FilterType } from '../types';
import { Spinner } from './Spinner';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CycleIcon } from './icons/CycleIcon';

interface ImageViewerProps {
  originalImage: ImageState | null;
  editedImage: ImageState | null;
  appState: AppState;
  error: string | null;
  editIntensity: number;
  onIntensityChange: (intensity: number) => void;
  onContinueEditing: () => void;
  filter: FilterType;
}

const ImagePanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="w-full flex flex-col">
        <h3 className="text-lg font-medium text-center mb-3 text-[#E2E2E9]">{title}</h3>
        <div className="aspect-square w-full bg-[#111318] rounded-xl overflow-hidden flex items-center justify-center relative border border-[#8C919A]/50">
            {children}
        </div>
    </div>
);

const Placeholder: React.FC = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-[#C2C7D1]">
        <ImageIcon className="w-24 h-24 mb-4" />
        <p>Your edited image will appear here</p>
    </div>
);

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
    originalImage, 
    editedImage, 
    appState, 
    error, 
    editIntensity,
    onIntensityChange,
    onContinueEditing,
    filter
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCanvasFilter = (filter: FilterType): string => {
    switch (filter) {
      case FilterType.VINTAGE:
        return 'sepia(0.6) contrast(0.8) brightness(1.1) saturate(1.2)';
      case FilterType.POLAROID:
        return 'sepia(0.4) contrast(1.2) brightness(1.1) saturate(1.3)';
      case FilterType.BLACK_WHITE:
        return 'grayscale(1)';
      case FilterType.SEPIA:
        return 'sepia(1)';
      case FilterType.NEGATIVE:
        return 'invert(1)';
      default:
        return 'none';
    }
  };

  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const originalImg = new Image();
    const editedImg = new Image();

    let loadedImages = 0;
    const requiredImages = editedImage ? 2 : 1;

    const draw = () => {
        if (loadedImages < requiredImages) return;

        const { naturalWidth: width, naturalHeight: height } = originalImg;
        canvas.width = width;
        canvas.height = height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.filter = getCanvasFilter(filter);

        if (editedImage) {
            // Draw original image
            ctx.globalAlpha = 1.0;
            ctx.drawImage(originalImg, 0, 0);

            // Draw edited image on top with intensity alpha
            ctx.globalAlpha = editIntensity / 100;
            ctx.drawImage(editedImg, 0, 0, width, height);
        } else {
            // No edit, just draw the original with filter
            ctx.globalAlpha = 1.0;
            ctx.drawImage(originalImg, 0, 0);
        }
        
        // Reset canvas state
        ctx.globalAlpha = 1.0;
        ctx.filter = 'none';
    };

    originalImg.onload = () => {
        loadedImages++;
        draw();
    };
    if (editedImage) {
        editedImg.onload = () => {
            loadedImages++;
            draw();
        };
    }
    
    originalImg.src = originalImage.dataUrl;
    if (editedImage) {
        editedImg.src = editedImage.dataUrl;
    }

  }, [originalImage, editedImage, editIntensity, appState, filter]);

  const handleDownload = () => {
    if (!canvasRef.current || !originalImage) return;

    try {
        const canvas = canvasRef.current;
        const mimeType = (editedImage || originalImage).mimeType;
        const dataUrl = canvas.toDataURL(mimeType);
        const a = document.createElement('a');
        a.href = dataUrl;
        const extension = mimeType.split('/')[1]?.split('+')[0] || 'png';
        a.download = `edited-image.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (downloadError) {
        console.error("Failed to download image:", downloadError);
    }
  };
    
  return (
    <div className="flex flex-col gap-4">
      <ImagePanel title="Edited">
        {appState === AppState.LOADING && <Spinner />}

        <canvas 
          ref={canvasRef} 
          className={`w-full h-full object-contain ${(appState === AppState.RESULT || appState === AppState.IMAGE_CROPPED) ? 'block' : 'hidden'}`}
          aria-label="Blended edited image"
        />
        
        {!(appState === AppState.RESULT || appState === AppState.IMAGE_CROPPED) && (
          <>
            {appState !== AppState.LOADING && !editedImage && !error && <Placeholder />}
            {appState === AppState.ERROR && error && (
                <div className="p-6 text-center text-[#FFB4AB] flex flex-col items-center justify-center">
                    <AlertTriangleIcon className="w-16 h-16 mb-4"/>
                    <p className="font-semibold">Editing Failed</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
          </>
        )}
      </ImagePanel>

      {appState === AppState.RESULT && editedImage && (
          <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                      <label htmlFor="intensity" className="text-sm font-medium text-[#C2C7D1]">Edit Intensity</label>
                      <span className="text-sm font-mono text-[#A3C9FF] bg-[#004884]/30 px-2 py-1 rounded">{editIntensity}%</span>
                  </div>
                  <input
                      id="intensity"
                      type="range"
                      min="0"
                      max="100"
                      value={editIntensity}
                      onChange={(e) => onIntensityChange(Number(e.target.value))}
                      className="w-full h-2 bg-[#111318] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#A3C9FF] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#A3C9FF] [&::-moz-range-thumb]:border-none"
                      aria-label="Edit intensity slider"
                      title={`Current intensity: ${editIntensity}%`}
                  />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                      onClick={onContinueEditing}
                      title="Use this edited image as the new original for further edits"
                      className="inline-flex items-center justify-center px-6 py-3 border border-[#8C919A] text-sm font-semibold rounded-full text-[#A3C9FF] hover:bg-[#A3C9FF]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1D2025] focus:ring-[#A3C9FF] transition-colors"
                  >
                      <CycleIcon className="w-5 h-5 mr-2" />
                      Continue Editing
                  </button>
                  <button
                      onClick={handleDownload}
                      title="Download the final edited image"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full shadow-sm text-[#00315E] bg-[#A3C9FF] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1D2025] focus:ring-[#A3C9FF] transition-colors"
                  >
                      <DownloadIcon className="w-5 h-5 mr-2" />
                      Download Image
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};