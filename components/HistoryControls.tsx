/** @copyright sapthesh */
import React from 'react';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';

interface HistoryControlsProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
    const buttonClasses = "p-2 rounded-full transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
    const enabledClasses = "text-[#A3C9FF] bg-transparent hover:bg-[#A3C9FF]/10";
    const disabledClasses = "text-[#8C919A]";

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className={`${buttonClasses} ${canUndo ? enabledClasses : disabledClasses}`}
            >
                <UndoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className={`${buttonClasses} ${canRedo ? enabledClasses : disabledClasses}`}
            >
                <RedoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        </div>
    );
};
