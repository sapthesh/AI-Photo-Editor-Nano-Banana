/** @copyright sapthesh */
import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ResetIcon } from './icons/ResetIcon';
import { ImageEditModel } from '../types';

interface EditControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  model: ImageEditModel;
  setModel: (model: ImageEditModel) => void;
}

const ModelButton: React.FC<{
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ label, description, isActive, onClick, disabled }) => {
  const baseClasses = "flex-1 p-4 border rounded-lg text-left transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
  const activeClasses = "bg-[#004884]/40 border-[#A3C9FF] ring-2 ring-[#A3C9FF]";
  const inactiveClasses = "bg-[#111318] border-[#8C919A] hover:bg-[#282A2F]";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <p className="font-semibold text-[#E2E2E9]">{label}</p>
      <p className="text-sm text-[#C2C7D1]">{description}</p>
    </button>
  );
};

export const EditControls: React.FC<EditControlsProps> = ({ prompt, setPrompt, onSubmit, onReset, isLoading, model, setModel }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <label className="block text-base font-medium text-[#C2C7D1] mb-2">
          Choose Editing Style
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <ModelButton
            label="Standard"
            description="Reliable, high-quality edits."
            isActive={model === ImageEditModel.STANDARD}
            onClick={() => setModel(ImageEditModel.STANDARD)}
            disabled={isLoading}
          />
          <ModelButton
            label="Creative"
            description="More artistic & dramatic results."
            isActive={model === ImageEditModel.CREATIVE}
            onClick={() => setModel(ImageEditModel.CREATIVE)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-base font-medium text-[#C2C7D1] mb-2">
          Describe your edit
        </label>
        <textarea
          id="prompt"
          rows={3}
          className="block w-full p-4 text-[#E2E2E9] bg-[#111318] border border-[#8C919A] rounded-xl focus:border-[#A3C9FF] focus:ring-2 focus:ring-[#A3C9FF]/50 transition"
          placeholder="e.g., 'add a pair of sunglasses to the cat' or 'make the sky look like a sunset'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSubmit}
          disabled={isLoading || !prompt.trim()}
          className="flex-grow inline-flex items-center justify-center px-8 py-3 text-sm font-semibold rounded-full shadow-sm text-[#00315E] bg-[#A3C9FF] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1D2025] focus:ring-[#A3C9FF] disabled:bg-[#C2C7D1]/20 disabled:text-[#C2C7D1]/50 disabled:cursor-not-allowed transition-colors"
        >
            <MagicWandIcon className="w-5 h-5 mr-2"/>
          {isLoading ? 'Generating...' : 'Apply Edit'}
        </button>
        <button
          onClick={onReset}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 border border-[#8C919A] text-sm font-semibold rounded-full text-[#A3C9FF] hover:bg-[#A3C9FF]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1D2025] focus:ring-[#A3C9FF] disabled:border-[#C2C7D1]/20 disabled:text-[#C2C7D1]/50 disabled:cursor-not-allowed transition-colors"
        >
            <ResetIcon className="w-5 h-5 mr-2" />
          Start Over
        </button>
      </div>
    </div>
  );
};