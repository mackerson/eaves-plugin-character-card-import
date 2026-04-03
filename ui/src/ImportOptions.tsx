import { useState } from 'react';

interface ImportOptionsProps {
  card: any;
  onStart: (options: ImportOptions) => void;
  onBack: () => void;
  isLoading: boolean;
}

interface ImportOptions {
  model?: string;
  provider?: string;
  includeGreeting?: boolean;
  includeExamples?: boolean;
  includePostInstructions?: boolean;
}

const PROVIDERS = [
  { id: 'anthropic', name: 'Anthropic (Claude)' },
  { id: 'openai', name: 'OpenAI (GPT)' },
  { id: 'ollama', name: 'Ollama (Local)' },
  { id: 'lmstudio', name: 'LM Studio (Local)' },
];

const MODELS: Record<string, { id: string; name: string }[]> = {
  anthropic: [
    { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  ],
  ollama: [
    { id: 'llama3.2', name: 'Llama 3.2' },
    { id: 'mistral', name: 'Mistral' },
    { id: 'mixtral', name: 'Mixtral' },
  ],
  lmstudio: [
    { id: 'local-model', name: 'Local Model (auto-detect)' },
  ],
};

export function ImportOptions({ card, onStart, onBack, isLoading }: ImportOptionsProps) {
  const data = card.data || card;

  const [options, setOptions] = useState<ImportOptions>({
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    includeGreeting: true,
    includeExamples: true,
    includePostInstructions: false,
  });

  const handleProviderChange = (provider: string) => {
    setOptions(prev => ({
      ...prev,
      provider,
      model: MODELS[provider]?.[0]?.id || '',
    }));
  };

  const handleSubmit = () => {
    onStart(options);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configure Import</h2>
        <p className="text-text-secondary">
          Customize how <strong>{data.name}</strong> will be created as an Enclave agent.
        </p>
      </div>

      {/* Model Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold">AI Model</h3>

        {/* Provider */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Provider</label>
          <select
            value={options.provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Model</label>
          <select
            value={options.model}
            onChange={(e) => setOptions(prev => ({ ...prev, model: e.target.value }))}
            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            {MODELS[options.provider!]?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Import Options */}
      <div className="space-y-4">
        <h3 className="font-semibold">Import Options</h3>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeExamples}
            onChange={(e) => setOptions(prev => ({ ...prev, includeExamples: e.target.checked }))}
            className="mt-1 rounded"
          />
          <div>
            <span className="font-medium">Include example dialogues</span>
            <p className="text-sm text-text-secondary">
              Add example messages to help the AI understand the character's speaking style.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeGreeting}
            onChange={(e) => setOptions(prev => ({ ...prev, includeGreeting: e.target.checked }))}
            className="mt-1 rounded"
          />
          <div>
            <span className="font-medium">Store opening message</span>
            <p className="text-sm text-text-secondary">
              Save the first message for starting new conversations with this character.
            </p>
          </div>
        </label>

        {data.post_history_instructions && (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includePostInstructions}
              onChange={(e) => setOptions(prev => ({ ...prev, includePostInstructions: e.target.checked }))}
              className="mt-1 rounded"
            />
            <div>
              <span className="font-medium">Include post-history instructions</span>
              <p className="text-sm text-text-secondary">
                Add additional instructions that appear after the conversation history.
                <span className="text-status-warning ml-1">(May include roleplay-specific formatting)</span>
              </p>
            </div>
          </label>
        )}
      </div>

      {/* Preview Summary */}
      <div className="p-4 bg-bg-tertiary rounded-md border border-border-secondary">
        <h4 className="font-semibold mb-2">Import Summary</h4>
        <ul className="text-sm space-y-1">
          <li>
            <span className="text-text-secondary">Name:</span> {data.name}
          </li>
          <li>
            <span className="text-text-secondary">Provider:</span>{' '}
            {PROVIDERS.find(p => p.id === options.provider)?.name}
          </li>
          <li>
            <span className="text-text-secondary">Model:</span>{' '}
            {MODELS[options.provider!]?.find(m => m.id === options.model)?.name || options.model}
          </li>
          <li>
            <span className="text-text-secondary">Avatar:</span> Will be imported from character card
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-border-primary">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-2 bg-bg-tertiary border border-border-primary rounded-md hover:bg-bg-hover transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Creating Agent...
            </>
          ) : (
            <>
              <span>✨</span>
              Create Agent
            </>
          )}
        </button>
      </div>
    </div>
  );
}
