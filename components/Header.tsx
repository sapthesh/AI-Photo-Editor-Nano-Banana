/** @copyright sapthesh */
import React from 'react';
import { BananaIcon } from './icons/BananaIcon';
import { HistoryControls } from './HistoryControls';

interface HeaderProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
  return (
    <header className="py-4 sm:py-6 relative">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
            <BananaIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#A3C9FF]" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#A3C9FF]">
                Nano Banana AI Photo Editor
            </h1>
        </div>
        <p className="mt-2 text-base sm:text-lg text-[#C2C7D1]">
          Bring your creative visions to life. Just describe the changes you want.
        </p>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 md:right-8">
        <HistoryControls 
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>
    </header>
  );
};
