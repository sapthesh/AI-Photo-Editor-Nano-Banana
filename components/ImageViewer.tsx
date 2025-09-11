/** @copyright sapthesh */
import React, { useRef, useEffect } from 'react';
import { AppState, ImageState } from '../types';
import { Spinner } from './Spinner';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageViewerProps {
  originalImage: string | null;
  editedImage: ImageState | null;
  appState: AppState;
  error: string | null;
  editIntensity: number;
  onIntensityChange: (intensity: number) => void;
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
    onIntensityChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (appState !== AppState.RESULT || !originalImage || !editedImage || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const originalImg = new Image();
    const editedImg = new Image();

    let imagesLoaded = 0;
    const totalImages = 2;

    const drawImages = () => {
        if (imagesLoaded < totalImages) return;

        const { naturalWidth: width, naturalHeight: height } = originalImg;
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        // Draw original image
        ctx.globalAlpha = 1.0;
        ctx.drawImage(originalImg, 0, 0);

        // Draw edited image on top with intensity alpha
        ctx.globalAlpha = editIntensity / 100;
        ctx.drawImage(editedImg, 0, 0, width, height);

        // Reset alpha
        ctx.globalAlpha = 1.0;
    };
    
    originalImg.onload = () => {
        imagesLoaded++;
        drawImages();
    };
    editedImg.onload = () => {
        imagesLoaded++;
        drawImages();
    };

    originalImg.src = originalImage;
    editedImg.src = editedImage.dataUrl;

  }, [originalImage, editedImage, editIntensity, appState]);

  const handleDownload = () => {
    if (!canvasRef.current || !editedImage) return;

    try {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL(editedImage.mimeType);
        const a = document.createElement('a');
        a.href = dataUrl;
        const extension = editedImage.mimeType.split('/')[1]?.split('+')[0] || 'png';
        a.download = `edited-image-intensity-${editIntensity}.${extension}`;
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
          className={`w-full h-full object-contain ${appState === AppState.RESULT && editedImage ? 'block' : 'hidden'}`}
          aria-label="Blended edited image"
        />
        
        {!(appState === AppState.RESULT && editedImage) && (
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
                  />
              </div>
              <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full shadow-sm text-[#A3C9FF] bg-[#004884]/40 hover:bg-[#004884]/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1D2025] focus:ring-[#A3C9FF] transition-colors"
              >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Download Edited Image
              </button>
          </div>
      )}
    </div>
  );
};