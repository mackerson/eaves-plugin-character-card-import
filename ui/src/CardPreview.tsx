interface CardPreviewProps {
  card: any;
  filePath: string;
  onContinue: () => void;
  onBack: () => void;
}

export function CardPreview({ card, onContinue, onBack }: CardPreviewProps) {
  const data = card.data || card;

  // The preview handler in the plugin's index.cjs base64-encodes the PNG
  // and attaches it as imageDataUrl. file:// URLs are CSP-blocked by the
  // renderer and the file-service:// protocol only knows about persisted
  // attachments — neither works for a card that hasn't been imported yet.
  const imageUrl: string | undefined = card.imageDataUrl;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Character Preview</h2>
        <p className="text-text-secondary">
          Review the character information before importing.
        </p>
      </div>

      {/* Character Header */}
      <div className="flex gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-bg-tertiary border border-border-primary flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={data.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-text-tertiary text-xs text-center px-2">No preview</span>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold">{data.name}</h3>
          {data.creator && (
            <p className="text-sm text-text-secondary">
              by {data.creator}
              {data.character_version && ` • v${data.character_version}`}
            </p>
          )}
          {data.personality && (
            <p className="text-sm">
              <span className="font-medium">Personality:</span>{' '}
              {data.personality}
            </p>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-bg-tertiary text-text-secondary text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-text-secondary uppercase tracking-wide">
            Description
          </h4>
          <div className="p-4 bg-bg-tertiary rounded-md border border-border-secondary max-h-48 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{data.description}</p>
          </div>
        </div>
      )}

      {/* Scenario */}
      {data.scenario && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-text-secondary uppercase tracking-wide">
            Scenario
          </h4>
          <div className="p-4 bg-bg-tertiary rounded-md border border-border-secondary max-h-32 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{data.scenario}</p>
          </div>
        </div>
      )}

      {/* First Message Preview */}
      {data.first_mes && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-text-secondary uppercase tracking-wide">
            Opening Message
          </h4>
          <div className="p-4 bg-bg-tertiary rounded-md border border-border-secondary max-h-48 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap italic">{data.first_mes}</p>
          </div>
        </div>
      )}

      {/* Creator Notes */}
      {data.creator_notes && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-text-secondary uppercase tracking-wide">
            Creator Notes
          </h4>
          <div className="p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-md">
            <p className="text-sm">{data.creator_notes}</p>
          </div>
        </div>
      )}

      {/* Card Spec Info */}
      <div className="text-xs text-text-tertiary">
        Card Format: {card.spec || 'Unknown'} {card.spec_version ? `v${card.spec_version}` : ''}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-border-primary">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-bg-tertiary border border-border-primary rounded-md hover:bg-bg-hover transition-colors"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors"
        >
          Continue to Options
        </button>
      </div>
    </div>
  );
}
