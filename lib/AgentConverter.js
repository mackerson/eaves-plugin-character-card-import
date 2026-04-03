/**
 * Agent Converter
 * Converts character card data to Enclave agent format
 */

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * Template variable replacements for character card format
 */
const TEMPLATE_VARS = {
  '{{char}}': '{{agent}}',
  '{{user}}': '{{user}}',
  '{{User}}': '{{user}}',
  '{{Char}}': '{{agent}}',
  '<BOT>': '{{agent}}',
  '<USER>': '{{user}}',
  '<bot>': '{{agent}}',
  '<user>': '{{user}}',
  '[character]': '{{agent}}',
  '[user]': '{{user}}'
};

class AgentConverter {
  constructor(context) {
    this.context = context;
    this.avatarBasePath = path.join(app.getPath('userData'), 'avatars');

    // Ensure avatar directory exists
    if (!fs.existsSync(this.avatarBasePath)) {
      fs.mkdirSync(this.avatarBasePath, { recursive: true });
    }
  }

  /**
   * Convert a character card to an Enclave agent
   * @param {object} card - Normalized V2 character card
   * @param {object} options - Conversion options
   * @returns {object} Agent data ready for creation
   */
  convert(card, options = {}) {
    const data = card.data;
    this.context.utils.log.info(`Converting character card: ${data.name}`);

    // Build system prompt from card components
    const systemPrompt = this.buildSystemPrompt(data, options);

    // Generate a random color for the agent
    const color = this.generateColor(data.name);

    // Determine model (use option or default)
    const model = options.model || 'claude-sonnet-4-20250514';
    const provider = options.provider || 'anthropic';

    const agent = {
      name: data.name,
      description: this.buildDescription(data),
      systemPrompt: systemPrompt,
      model: model,
      provider: provider,
      color: color,
      // Store original card data in metadata for reference
      metadata: {
        importedFrom: 'character-card',
        cardSpec: card.spec,
        cardVersion: card.spec_version,
        creator: data.creator || 'Unknown',
        characterVersion: data.character_version || '1.0',
        originalTags: data.tags || [],
        creatorNotes: data.creator_notes || '',
        sourceFile: card._source
      }
    };

    // Handle avatar if source file provided
    if (card._source && options.importAvatar !== false) {
      try {
        const avatarPath = this.copyAvatar(card._source, data.name);
        if (avatarPath) {
          agent.avatar = avatarPath;
        }
      } catch (e) {
        this.context.utils.log.warn('Failed to copy avatar:', e.message);
      }
    }

    // Include first message if requested
    if (options.includeGreeting && data.first_mes) {
      agent.greeting = this.replaceTemplateVars(data.first_mes);
    }

    return agent;
  }

  /**
   * Build the system prompt from character card components
   * @param {object} data - Character card data
   * @param {object} options - Conversion options
   * @returns {string} System prompt
   */
  buildSystemPrompt(data, options = {}) {
    const parts = [];

    // Start with explicit system prompt if provided
    if (data.system_prompt) {
      parts.push(this.replaceTemplateVars(data.system_prompt));
    }

    // Character identity
    parts.push(`You are ${data.name}.`);

    // Personality traits
    if (data.personality) {
      parts.push(`\nPersonality: ${this.replaceTemplateVars(data.personality)}`);
    }

    // Character description/background
    if (data.description) {
      parts.push(`\n${this.replaceTemplateVars(data.description)}`);
    }

    // Scenario context
    if (data.scenario) {
      parts.push(`\nScenario: ${this.replaceTemplateVars(data.scenario)}`);
    }

    // Example messages (helps establish voice/style)
    if (data.mes_example && options.includeExamples !== false) {
      const examples = this.replaceTemplateVars(data.mes_example);
      if (examples.trim()) {
        parts.push(`\nExample dialogue style:\n${examples}`);
      }
    }

    // Post-history instructions (jailbreak/additional instructions)
    if (data.post_history_instructions && options.includePostInstructions) {
      parts.push(`\n${this.replaceTemplateVars(data.post_history_instructions)}`);
    }

    return parts.join('\n').trim();
  }

  /**
   * Build a short description from card data
   * @param {object} data - Character card data
   * @returns {string} Description
   */
  buildDescription(data) {
    // Use personality as description, or extract first sentence of description
    if (data.personality) {
      return data.personality.substring(0, 200);
    }

    if (data.description) {
      // Get first sentence or first 200 chars
      const firstSentence = data.description.split(/[.!?]/)[0];
      return firstSentence.substring(0, 200).trim();
    }

    return `Imported character: ${data.name}`;
  }

  /**
   * Replace template variables with Enclave format
   * @param {string} text - Text with template variables
   * @returns {string} Text with replaced variables
   */
  replaceTemplateVars(text) {
    if (!text) return '';

    let result = text;
    for (const [from, to] of Object.entries(TEMPLATE_VARS)) {
      // Case-insensitive replacement
      const regex = new RegExp(from.replace(/[{}[\]]/g, '\\$&'), 'gi');
      result = result.replace(regex, to);
    }

    return result;
  }

  /**
   * Copy the character card image as an avatar
   * @param {string} sourcePath - Path to character card PNG
   * @param {string} name - Character name
   * @returns {string|null} Path to copied avatar
   */
  copyAvatar(sourcePath, name) {
    // Generate filename from name
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const timestamp = Date.now();
    const avatarFilename = `${safeName}_${timestamp}.png`;
    const avatarPath = path.join(this.avatarBasePath, avatarFilename);

    // Copy the file
    fs.copyFileSync(sourcePath, avatarPath);
    this.context.utils.log.info(`Copied avatar to: ${avatarPath}`);

    return avatarPath;
  }

  /**
   * Generate a consistent color based on name
   * @param {string} name - Character name
   * @returns {string} Hex color
   */
  generateColor(name) {
    // Hash the name to get a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to HSL for better colors (avoid too dark/light)
    const h = Math.abs(hash % 360);
    const s = 60 + (Math.abs(hash >> 8) % 20); // 60-80% saturation
    const l = 45 + (Math.abs(hash >> 16) % 15); // 45-60% lightness

    // Convert HSL to Hex
    return this.hslToHex(h, s, l);
  }

  /**
   * Convert HSL to Hex color
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-100)
   * @param {number} l - Lightness (0-100)
   * @returns {string} Hex color
   */
  hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (n) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}

module.exports = AgentConverter;
