import { useState } from 'react';

interface FileSelectorProps {
  onSelect: (filePath: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function FileSelector({ onSelect, isLoading, error }: FileSelectorProps) {
  const [filePath, setFilePath] = useState('');

  const handleBrowse = async () => {
    try {
      const result = await window.electron.openFile({
        title: 'Select Character Card',
        filters: [
          { name: 'Character Cards', extensions: ['png'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        setFilePath(result.filePaths[0]);
      }
    } catch (err: any) {
      console.error('Failed to open file dialog:', err);
    }
  };

  const handleContinue = () => {
    if (filePath) {
      onSelect(filePath);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Character Card</h2>
        <p className="text-text-secondary">
          Choose a PNG character card file. Character cards contain embedded metadata
          that defines the character's personality, backstory, and behavior.
        </p>
      </div>

      {/* File Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Character Card File
          <span className="text-status-error ml-1">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            placeholder="/path/to/character-card.png"
            className="flex-1 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          <button
            onClick={handleBrowse}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors"
          >
            Browse
          </button>
        </div>
        <p className="text-xs text-text-tertiary">
          Supports Character Card V2 format (used by SillyTavern, TavernAI, etc.)
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error rounded-md">
          <p className="text-status-error text-sm">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-bg-tertiary rounded-md border border-border-secondary">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <span>ℹ️</span>
          What are Character Cards?
        </h3>
        <div className="text-sm text-text-secondary space-y-2">
          <p>
            Character cards are PNG images with embedded JSON metadata that describe
            an AI character's personality, appearance, and behavior.
          </p>
          <p>
            Popular sources include:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Chub.ai - Large character database</li>
            <li>Character Hub - Community characters</li>
            <li>SillyTavern exports</li>
            <li>TavernAI exports</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 border-t border-border-primary">
        <button
          onClick={handleContinue}
          disabled={!filePath || isLoading}
          className="px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Reading Card...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  );
}
