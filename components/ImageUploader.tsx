/** @copyright sapthesh */
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  uploadProgress: number | null;
  error: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadProgress, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const baseClasses = "flex flex-col items-center justify-center w-full min-h-[320px] border rounded-xl cursor-pointer transition-colors duration-300";
  const inactiveClasses = "border-[#8C919A] bg-[#111318] hover:bg-[#282A2F]";
  const activeClasses = "border-[#A3C9FF] bg-[#004884]/30 ring-2 ring-[#A3C9FF]";
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-medium mb-4 text-[#E2E2E9]">Start by uploading a photo</h2>
        <label
            htmlFor="dropzone-file"
            className={`${baseClasses} ${isDragging ? activeClasses : inactiveClasses}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            {uploadProgress !== null ? (
                <div className="w-full max-w-xs p-4 text-center">
                    <p className="text-lg font-medium text-[#E2E2E9] mb-4">Uploading...</p>
                    <div className="w-full bg-[#111318] rounded-full h-2.5 border border-[#8C919A]/50">
                        <div 
                            className="bg-[#A3C9FF] h-2 rounded-full transition-all duration-300 ease-linear" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <p className="mt-4 text-2xl font-mono text-[#A3C9FF]">{uploadProgress}%</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-[#A3C9FF]' : 'text-[#C2C7D1]'}`} />
                    <p className="mb-2 text-sm text-[#C2C7D1]">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-[#8C919A]">PNG, JPG, WEBP, or GIF</p>
                </div>
            )}
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={uploadProgress !== null} />
        </label>
        {error && (
            <div className="mt-4 p-3 w-full max-w-md flex items-center gap-3 text-sm text-[#FFB4AB] bg-[#5F1814] border border-[#FFB4AB]/30 rounded-lg">
                <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}
    </div>
  );
};