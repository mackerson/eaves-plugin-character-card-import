import { useEffect, useMemo, useRef, useState } from 'react';

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

interface ProviderMeta {
  id: string;
  label: string;
  icon: string;
  description: string;
  needsKey: boolean;
  isLocalEndpoint: boolean;
}

// Provider-specific placeholder hints when the live model list isn't available
// (no key set, network error). The user can still type a model id by hand.
const MODEL_PLACEHOLDER: Record<string, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
  google: 'gemini-2.5-flash',
  openrouter: 'anthropic/claude-sonnet-4-5',
  ollama: 'llama3.2',
  lmstudio: 'local-model',
};

export function ImportOptions({ card, onStart, onBack, isLoading }: ImportOptionsProps) {
  const data = card.data || card;

  const [providers, setProviders] = useState<ProviderMeta[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const [options, setOptions] = useState<ImportOptions>({
    provider: 'anthropic',
    model: '',
    includeGreeting: true,
    includeExamples: true,
    includePostInstructions: false,
  });

  // Pull the registry-shaped provider list from the host on mount.
  // Falls back to a single 'anthropic' option if the host IPC isn't wired
  // (older Eaves builds without list-providers).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await window.electron?.listProviders?.();
        if (cancelled) return;
        if (result?.success && result.providers && result.providers.length > 0) {
          setProviders(result.providers);
          // Prefer anthropic as the default for character cards (most common
          // setup), fall back to whatever's first.
          const preferred = result.providers.find(p => p.id === 'anthropic') ?? result.providers[0];
          setOptions(prev => ({ ...prev, provider: preferred.id }));
        }
      } catch {
        // Silent fallback — leave providers empty so the UI shows a manual entry.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch models whenever the chosen provider changes.
  useEffect(() => {
    if (!options.provider) return;
    let cancelled = false;
    setModelError(null);
    setLoadingModels(true);

    (async () => {
      try {
        const result = await window.electron?.fetchModels?.(options.provider!);
        if (cancelled) return;
        if (result?.success && result.models) {
          setModels(result.models);
          setOptions(prev => ({
            ...prev,
            model: result.models![0] ?? prev.model ?? MODEL_PLACEHOLDER[prev.provider ?? ''] ?? '',
          }));
        } else {
          setModels([]);
          setModelError(result?.error || 'Could not list models for this provider');
          // Keep a placeholder model id so the user can still proceed.
          setOptions(prev => ({
            ...prev,
            model: MODEL_PLACEHOLDER[prev.provider ?? ''] ?? prev.model ?? '',
          }));
        }
      } catch (e: any) {
        if (cancelled) return;
        setModels([]);
        setModelError(e?.message || 'Could not list models');
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    })();

    return () => { cancelled = true; };
  }, [options.provider]);

  const handleSubmit = () => {
    onStart(options);
  };

  const providerLabel = providers.find(p => p.id === options.provider)?.label ?? options.provider;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configure Import</h2>
        <p className="text-text-secondary">
          Customize how <strong>{data.name}</strong> will be created as an Eaves agent.
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
            onChange={(e) => setOptions(prev => ({ ...prev, provider: e.target.value }))}
            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            disabled={providers.length === 0}
          >
            {providers.length === 0 ? (
              <option value="anthropic">Anthropic (default)</option>
            ) : (
              providers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Model — searchable when the live list is long, plain select for short
            lists, free-text input when the model fetch failed. */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Model</label>
          {models.length > 30 ? (
            <ModelCombobox
              value={options.model ?? ''}
              options={models}
              onChange={(next) => setOptions(prev => ({ ...prev, model: next }))}
              disabled={loadingModels}
              placeholder={MODEL_PLACEHOLDER[options.provider ?? ''] ?? 'Search models…'}
            />
          ) : models.length > 0 ? (
            <select
              value={options.model}
              onChange={(e) => setOptions(prev => ({ ...prev, model: e.target.value }))}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              disabled={loadingModels}
            >
              {models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={options.model ?? ''}
              onChange={(e) => setOptions(prev => ({ ...prev, model: e.target.value }))}
              placeholder={MODEL_PLACEHOLDER[options.provider ?? ''] ?? 'model-name'}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          )}
          {loadingModels && (
            <p className="text-xs text-text-tertiary">Loading models…</p>
          )}
          {modelError && !loadingModels && (
            <p className="text-xs text-status-warning">
              {modelError}. Type a model id manually or set a key in Settings.
            </p>
          )}
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
              Save the first message — it's auto-posted when you start a new chat with this agent.
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
            <span className="text-text-secondary">Provider:</span> {providerLabel}
          </li>
          <li>
            <span className="text-text-secondary">Model:</span> {options.model || '(none selected)'}
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
          disabled={isLoading || !options.model}
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

// Inline searchable picker — lifted from the host's ModelCombobox idea.
// Plugin UIs are bundled separately, so we keep this self-contained instead of
// trying to share the host component.
function ModelCombobox({
  value, options, onChange, disabled, placeholder,
}: {
  value: string;
  options: string[];
  onChange: (next: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === value.toLowerCase()) return options.slice(0, 100);
    return options.filter(o => o.toLowerCase().includes(q)).slice(0, 100);
  }, [query, value, options]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const commit = (next: string) => {
    onChange(next);
    setQuery(next);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
        onBlur={() => { if (query !== value) onChange(query); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(i => Math.min(i + 1, filtered.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
          else if (e.key === 'Enter' && open && filtered[active]) { e.preventDefault(); commit(filtered[active]); }
          else if (e.key === 'Escape') { setOpen(false); setQuery(value); }
        }}
        className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
      />
      {open && filtered.length > 0 && (
        // Inline style for the background — Tailwind theme tokens like
        // bg-bg-secondary can resolve to semi-transparent values in some
        // themes, which lets the form below show through the popover.
        // Pin to an opaque var fallback and bump z-index above sibling
        // form rows so checkboxes / labels can't bleed through.
        <ul
          className="absolute mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-border-primary shadow-lg text-sm"
          style={{
            zIndex: 50,
            background: 'var(--bg-secondary, #1a1a1a)',
            color: 'var(--text-primary, #fff)',
          }}
        >
          {filtered.map((opt, idx) => (
            <li
              key={opt}
              onMouseEnter={() => setActive(idx)}
              onMouseDown={(e) => { e.preventDefault(); commit(opt); }}
              className={`px-3 py-1.5 cursor-pointer truncate ${idx === active ? 'bg-accent-primary/20' : ''} ${opt === value ? 'font-medium' : ''}`}
            >
              {opt}
            </li>
          ))}
          {options.length > filtered.length && (
            <li className="px-3 py-1.5 text-xs text-text-tertiary border-t border-border-primary">
              {filtered.length} of {options.length} — keep typing to narrow
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
