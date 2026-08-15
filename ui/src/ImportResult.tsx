interface ImportResultProps {
  result: {
    success: boolean;
    agent?: any;
    error?: string;
  };
  onReset: () => void;
  onViewAgents: () => void;
}

export function ImportResult({ result, onReset, onViewAgents }: ImportResultProps) {
  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-6xl block mb-4">😞</span>
          <h2 className="text-2xl font-bold mb-2">Import Failed</h2>
          <p className="text-text-secondary">
            Unfortunately, the character card could not be imported.
          </p>
        </div>

        <div className="p-4 bg-status-error/10 border border-status-error rounded-md">
          <p className="text-sm text-status-error">{result.error}</p>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={onReset}
            className="px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <span className="text-6xl block mb-4">🎉</span>
        <h2 className="text-2xl font-bold mb-2">Agent Created!</h2>
        <p className="text-text-secondary">
          Your character has been imported as an Eaves agent.
        </p>
      </div>

      {/* Agent Info */}
      {result.agent && (
        <div className="p-6 bg-bg-tertiary rounded-lg border border-border-secondary">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: result.agent.color || '#667eea' }}
            >
              {result.agent.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h3 className="text-xl font-bold">{result.agent.name}</h3>
              <p className="text-sm text-text-secondary">
                {result.agent.provider} / {result.agent.model}
              </p>
            </div>
          </div>

          {result.agent.description && (
            <p className="mt-4 text-sm text-text-secondary">
              {result.agent.description}
            </p>
          )}
        </div>
      )}

      {/* Next Steps */}
      <div className="p-4 bg-accent-primary/10 border border-accent-primary rounded-md">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <span>💡</span>
          Next Steps
        </h4>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>View your new agent in the Agents view</li>
          <li>Start a new chat with this character</li>
          <li>Customize the agent's settings or system prompt</li>
          <li>Import more character cards</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border-primary">
        <button
          onClick={onViewAgents}
          className="flex-1 px-6 py-3 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors font-medium"
        >
          View Agents
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-bg-tertiary border border-border-primary rounded-md hover:bg-bg-hover transition-colors"
        >
          Import Another
        </button>
      </div>
    </div>
  );
}
