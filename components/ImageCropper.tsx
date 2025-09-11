/** @copyright sapthesh */
import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import type { ImageState } from '../types';
import { CropIcon } from './icons/CropIcon';
import { ResetIcon } from './icons/ResetIcon';

// Helper function to generate a cropped image from a canvas
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  mimeType: string
): Promise<ImageState> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('Canvas 2D context is not available.'));
  }

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    const dataUrl = canvas.toDataURL(mimeType);
    const base64 = dataUrl.split(',')[1];
    resolve({ base64, mimeType, dataUrl });
  });
}


interface ImageCropperProps {
    image: ImageState;
    onConfirm: (croppedImage: ImageState) => void;
    onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ image, onConfirm, onCancel }) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);
    const [aspect, setAspect] = useState<number | undefined>(1);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        // FIX: The initial crop is now created with pixel units ('px') instead of percentage ('%')
        // to match the type expected by the `completedCrop` state (`PixelCrop`).
        const initialCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: 'px',
                    width: width * 0.9,
                },
                aspect, // Use aspect from state
                width,
                height
            ),
            width,
            height
        );
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    }
    
    const handleConfirmCrop = async () => {
        if (completedCrop?.width && completedCrop?.height && imgRef.current) {
            try {
                const croppedImage = await getCroppedImg(
                    imgRef.current,
                    completedCrop,
                    image.mimeType
                );
                onConfirm(croppedImage);
            } catch (e) {
                console.error('Cropping failed', e);
            }
        }
    };
    
    const aspectRatios = [
      { label: '1:1', value: 1 },
      { label: '4:3', value: 4 / 3 },
      { label: '16:9', value: 16 / 9 },
      { label: 'Free', value: undefined },
    ];

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <h2 className="text-xl font-medium text-[#E2E2E9]">Crop your image</h2>
            <p className="text-[#C2C7D1] text-center max-w-lg">
                Select the region you want to edit. The AI will focus its changes on this specific area.
            </p>

            <div className="w-full flex flex-col items-center gap-3">
                <label className="text-sm font-medium text-[#C2C7D1]">Aspect Ratio</label>
                <div className="flex flex-wrap justify-center gap-3">
                    {aspectRatios.map(({ label, value }) => (
                        <button
                            key={label}
                            onClick={() => setAspect(value)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-full border transition-colors duration-200 ${
                                aspect === value
                                    ? 'bg-[#A3C9FF] text-[#00315E] border-transparent'
                                    : 'bg-transparent text-[#A3C9FF] border-[#8C919A] hover:border-[#A3C9FF] hover:bg-[#A3C9FF]/10'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-full max-h-[60vh] overflow-hidden rounded-lg bg-black/50 flex justify-center items-center">
                <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={c => setCompletedCrop(c)}
                    aspect={aspect}
                    minWidth={100}
                    minHeight={100}
                >
                    <img
                        ref={imgRef}
                        alt="Image to crop"
                        src={image.dataUrl}
                        onLoad={onImageLoad}
                        style={{ maxHeight: '60vh', objectFit: 'contain' }}
                    />
                </ReactCrop>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleConfirmCrop}
                    disabled={!completedCrop?.width || !completedCrop?.height}
                    className="flex-grow inline-flex items-center justify-center px-8 py-3 text-sm font-semibold rounded-full shadow-sm text-[#00315E] bg-[#A3C9FF] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1D2025] focus:ring-[#A3C9FF] disabled:bg-[#C2C7D1]/20 disabled:text-[#C2C7D1]/50 disabled:cursor-not-allowed transition-colors"
                >
                    <CropIcon className="w-5 h-5 mr-2"/>
                    Confirm Selection
                </button>
                <button
                    onClick={onCancel}
                    className="inline-flex items-center justify-center px-8 py-3 border border-[#8C919A] text-sm font-semibold rounded-full text-[#A3C9FF] hover:bg-[#A3C9FF]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1D2025] focus:ring-[#A3C9FF] transition-colors"
                >
                    <ResetIcon className="w-5 h-5 mr-2" />
                    Cancel
                </button>
            </div>
        </div>
    );
};