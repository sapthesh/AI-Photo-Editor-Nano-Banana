/** @copyright sapthesh */
import React from 'react';
import { BananaIcon } from './icons/BananaIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-4">
            <BananaIcon className="w-10 h-10 text-[#A3C9FF]" />
            <h1 className="text-4xl font-bold tracking-tight text-[#A3C9FF]">
                Nano Banana AI Photo Editor
            </h1>
        </div>
        <p className="mt-2 text-lg text-[#C2C7D1]">
          Bring your creative visions to life. Just describe the changes you want.
        </p>
      </div>
    </header>
  );
};