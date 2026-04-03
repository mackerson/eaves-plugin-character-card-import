import { useState, useEffect } from 'react';
import { FileSelector } from './FileSelector';
import { CardPreview } from './CardPreview';
import { ImportOptions } from './ImportOptions';
import { ImportResult } from './ImportResult';

type WizardStep = 'select' | 'preview' | 'options' | 'result';

interface ImportState {
  filePath?: string;
  card?: any;
  options: {
    model?: string;
    provider?: string;
    includeGreeting?: boolean;
    includeExamples?: boolean;
    includePostInstructions?: boolean;
  };
  result?: {
    success: boolean;
    agent?: any;
    error?: string;
  };
}

interface CharacterCardImportWizardProps {
  onNavigate?: (view: string) => void;
}

export function CharacterCardImportWizard({ onNavigate }: CharacterCardImportWizardProps = {}) {
  const [step, setStep] = useState<WizardStep>('select');
  const [importState, setImportState] = useState<ImportState>({
    options: {
      includeExamples: true,
      includeGreeting: true,
      includePostInstructions: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for preview results
    const handlePreviewResult = (data: any) => {
      setIsLoading(false);
      if (data.success) {
        setImportState(prev => ({ ...prev, card: data.card }));
        setStep('preview');
        setError(null);
      } else {
        setError(data.error || 'Failed to read character card');
      }
    };

    // Listen for import completion
    const handleComplete = (data: any) => {
      setIsLoading(false);
      setImportState(prev => ({
        ...prev,
        result: {
          success: true,
          agent: data.agent,
        },
      }));
      setStep('result');
    };

    // Listen for import errors
    const handleError = (data: any) => {
      setIsLoading(false);
      setImportState(prev => ({
        ...prev,
        result: {
          success: false,
          error: data.message || 'Import failed',
        },
      }));
      setStep('result');
    };

    if (window.electron) {
      window.electron.on('character-card-import:preview-result', handlePreviewResult);
      window.electron.on('character-card-import:complete', handleComplete);
      window.electron.on('character-card-import:error', handleError);
    }

    return () => {
      if (window.electron) {
        window.electron.off('character-card-import:preview-result', handlePreviewResult);
        window.electron.off('character-card-import:complete', handleComplete);
        window.electron.off('character-card-import:error', handleError);
      }
    };
  }, []);

  const handleFileSelect = (filePath: string) => {
    setImportState(prev => ({ ...prev, filePath }));
    setIsLoading(true);
    setError(null);

    // Request preview via plugin event
    window.electron.emitPluginEvent('character-card-import:preview', { filePath });
  };

  const handleStartImport = (options: ImportState['options']) => {
    setImportState(prev => ({ ...prev, options }));
    setIsLoading(true);

    // Trigger import
    window.electron.emitPluginEvent('character-card-import:start', {
      filePath: importState.filePath,
      options,
    });
  };

  const handleReset = () => {
    setImportState({
      options: {
        includeExamples: true,
        includeGreeting: true,
        includePostInstructions: false,
      },
    });
    setStep('select');
    setError(null);
  };

  const handleViewAgents = () => {
    if (onNavigate) {
      onNavigate('agents');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <StepIndicator
          step={1}
          label="Select Card"
          active={step === 'select'}
          completed={step !== 'select'}
        />
        <div className="flex-1 h-px bg-border-primary mx-4" />
        <StepIndicator
          step={2}
          label="Preview"
          active={step === 'preview'}
          completed={step === 'options' || step === 'result'}
        />
        <div className="flex-1 h-px bg-border-primary mx-4" />
        <StepIndicator
          step={3}
          label="Configure"
          active={step === 'options'}
          completed={step === 'result'}
        />
        <div className="flex-1 h-px bg-border-primary mx-4" />
        <StepIndicator
          step={4}
          label="Complete"
          active={step === 'result'}
          completed={false}
        />
      </div>

      {/* Step Content */}
      <div className="bg-bg-secondary rounded-lg border border-border-primary p-8">
        {step === 'select' && (
          <FileSelector
            onSelect={handleFileSelect}
            isLoading={isLoading}
            error={error}
          />
        )}

        {step === 'preview' && importState.card && (
          <CardPreview
            card={importState.card}
            filePath={importState.filePath!}
            onContinue={() => setStep('options')}
            onBack={() => setStep('select')}
          />
        )}

        {step === 'options' && importState.card && (
          <ImportOptions
            card={importState.card}
            onStart={handleStartImport}
            onBack={() => setStep('preview')}
            isLoading={isLoading}
          />
        )}

        {step === 'result' && importState.result && (
          <ImportResult
            result={importState.result}
            onReset={handleReset}
            onViewAgents={handleViewAgents}
          />
        )}
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({ step, label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
          active
            ? 'bg-accent-primary text-white border-accent-primary'
            : completed
            ? 'bg-accent-primary/20 text-accent-primary border-accent-primary'
            : 'bg-bg-tertiary text-text-tertiary border-border-primary'
        }`}
      >
        {completed ? '✓' : step}
      </div>
      <span
        className={`text-sm font-medium ${
          active ? 'text-text-primary' : 'text-text-secondary'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
