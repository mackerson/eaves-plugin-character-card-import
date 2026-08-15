/**
 * Character Card Import Plugin for Eaves
 * Imports AI character cards (PNG with embedded metadata) as agents
 */

const fs = require('fs');
const CharacterCardParser = require('./lib/CharacterCardParser');
const AgentConverter = require('./lib/AgentConverter');

module.exports = {
  activate(context) {
    context.utils.log.info('Character Card Import plugin activated');

    // Register the import wizard view
    context.ui.registerView({
      id: 'character-card-import',
      title: 'Character Card Import',
      icon: 'imports',
      component: 'CharacterCardImportWizard',
    });

    // Register import command
    context.ui.registerCommand({
      id: 'character-card-import.open-wizard',
      title: 'Import Character Card',
      handler: async () => {
        context.utils.log.info('Opening character card import wizard');
        context.events.emit('character-card-import:open-wizard');
      },
    });

    // Register the preview handler (for validating cards before import)
    context.events.on('character-card-import:preview', async (eventOrData) => {
      try {
        const data = eventOrData?.data || eventOrData;
        const { filePath } = data;

        context.utils.log.info('Previewing character card:', filePath);

        const parser = new CharacterCardParser(context);
        const card = await parser.parse(filePath);

        // Inline the PNG as a data URL so the preview UI can render it
        // directly. file:// URLs are blocked by the renderer's CSP, and
        // the file-service:// protocol only serves files registered as
        // attachments. base64 keeps the wire shape simple and the image
        // is small (character card PNGs are typically <500 KB).
        let imageDataUrl;
        try {
          const png = fs.readFileSync(filePath);
          imageDataUrl = `data:image/png;base64,${png.toString('base64')}`;
        } catch (e) {
          context.utils.log.warn('Could not encode card image for preview:', e?.message);
        }

        context.utils.log.info('Successfully parsed character card:', card.data.name);

        context.events.emit('character-card-import:preview-result', {
          success: true,
          card: imageDataUrl ? { ...card, imageDataUrl } : card,
        });
      } catch (error) {
        context.utils.log.error('Failed to preview character card:', error);
        context.events.emit('character-card-import:preview-result', {
          success: false,
          error: error.message,
        });
      }
    });

    // Register the main import handler
    context.events.on('character-card-import:start', async (eventOrData) => {
      try {
        const data = eventOrData?.data || eventOrData;
        const { filePath, options = {} } = data;

        context.utils.log.info('Starting character card import:', {
          filePath,
          options,
        });

        context.events.emit('character-card-import:progress', {
          stage: 'parsing',
          message: 'Reading character card...',
          progress: 10,
        });

        // Parse the character card
        const parser = new CharacterCardParser(context);
        const card = await parser.parse(filePath);

        context.utils.log.info(`Parsed character: ${card.data.name}`);

        context.events.emit('character-card-import:progress', {
          stage: 'converting',
          message: `Converting ${card.data.name} to agent...`,
          progress: 40,
        });

        // Convert to agent format
        const converter = new AgentConverter(context);
        const agentData = converter.convert(card, options);

        context.utils.log.info('Converted to agent data:', agentData.name);

        context.events.emit('character-card-import:progress', {
          stage: 'creating',
          message: `Creating agent: ${agentData.name}...`,
          progress: 70,
        });

        // Create the agent using the context actions API
        const result = await context.actions.createAgent(agentData);

        context.utils.log.info('Agent created successfully:', result.id);

        context.events.emit('character-card-import:progress', {
          stage: 'complete',
          message: 'Import complete!',
          progress: 100,
        });

        context.events.emit('character-card-import:complete', {
          success: true,
          agent: result,
          card: {
            name: card.data.name,
            creator: card.data.creator,
            version: card.data.character_version,
          },
        });

        context.utils.log.info('Character card import completed successfully');
      } catch (error) {
        context.utils.log.error('Character card import failed:', error);

        context.events.emit('character-card-import:error', {
          message: error.message,
          stack: error.stack,
        });
      }
    });

    context.utils.log.info('Character Card Import plugin registered successfully');
  },

  deactivate(context) {
    context.utils.log.info('Character Card Import plugin deactivated');
  },
};
