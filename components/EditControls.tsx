/** @copyright sapthesh */
import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ResetIcon } from './icons/ResetIcon';
import { ImageEditModel, FilterType } from '../types';

interface EditControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  model: ImageEditModel;
  setModel: (model: ImageEditModel) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
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

const FilterButton: React.FC<{
  label: FilterType;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ label, isActive, onClick, disabled }) => {
    const baseClasses = "px-4 py-2 border rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
    const activeClasses = "bg-[#A3C9FF] text-[#00315E] border-transparent";
    const inactiveClasses = "bg-[#111318] border-[#8C919A] text-[#C2C7D1] hover:bg-[#282A2F]";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {label}
        </button>
    );
};

export const EditControls: React.FC<EditControlsProps> = ({ prompt, setPrompt, onSubmit, onReset, isLoading, model, setModel, filter, onFilterChange }) => {
  const promptSuggestions = [
    'add a small, friendly robot next to the subject',
    'change the background to a futuristic city at night',
    'turn this into a watercolor painting',
    'make the colors more vibrant and saturated',
    'apply a vintage, sepia-toned photo effect',
    'make the subject look like a cartoon character',
    'replace the sky with a starry night',
    'add a dramatic sun flare in the corner',
    'change the lighting to golden hour',
    'make the main subject look like it is made of glass',
    'add falling snow throughout the image',
    'apply a double exposure effect with a forest silhouette',
  ];
  
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

      <div className="mb-6">
          <label className="block text-base font-medium text-[#C2C7D1] mb-2">
              Image Filters
          </label>
          <div className="flex flex-wrap gap-3">
              {(Object.values(FilterType)).map((filterType) => (
                  <FilterButton
                      key={filterType}
                      label={filterType}
                      isActive={filter === filterType}
                      onClick={() => onFilterChange(filterType)}
                      disabled={isLoading}
                  />
              ))}
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

      <div className="mt-4">
          <p className="text-sm font-medium text-[#C2C7D1] mb-2">Need inspiration?</p>
          <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion, index) => (
                  <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-xs font-medium text-[#C2C7D1] bg-[#111318] border border-[#8C919A] rounded-full hover:bg-[#282A2F] hover:border-[#A3C9FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {suggestion}
                  </button>
              ))}
          </div>
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