/**
 * Character Card Parser
 * Extracts character card metadata from PNG files
 *
 * Supports:
 * - Character Card V2 (chara_card_v2) - most common format
 * - Character Card V1 (legacy)
 * - Tavern AI format
 */

const fs = require('fs');
const zlib = require('zlib');

/**
 * Character Card V2 schema (normalized)
 */
const EMPTY_CARD = {
  spec: 'chara_card_v2',
  spec_version: '2.0',
  data: {
    name: '',
    description: '',
    personality: '',
    scenario: '',
    first_mes: '',
    mes_example: '',
    creator_notes: '',
    system_prompt: '',
    post_history_instructions: '',
    tags: [],
    creator: '',
    character_version: '',
    alternate_greetings: [],
    extensions: {}
  }
};

class CharacterCardParser {
  constructor(context) {
    this.context = context;
  }

  /**
   * Parse a character card from a PNG file
   * @param {string} filePath - Path to the PNG file
   * @returns {Promise<object>} Parsed character card data
   */
  async parse(filePath) {
    this.context.utils.log.info(`Parsing character card: ${filePath}`);

    // Read PNG file
    const buffer = fs.readFileSync(filePath);

    // Validate PNG signature
    const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
      throw new Error('Invalid PNG file - signature mismatch');
    }

    // Extract text chunks
    const chunks = this.extractTextChunks(buffer);
    this.context.utils.log.info(`Found ${chunks.length} text chunks`);

    // Look for character card data
    let cardData = null;

    for (const chunk of chunks) {
      this.context.utils.log.debug(`Processing chunk: ${chunk.keyword}`);

      if (chunk.keyword === 'chara') {
        // Standard character card format - base64 encoded JSON
        try {
          const decoded = Buffer.from(chunk.text, 'base64').toString('utf-8');
          cardData = JSON.parse(decoded);
          this.context.utils.log.info('Found character card in "chara" chunk');
          break;
        } catch (e) {
          this.context.utils.log.warn('Failed to decode "chara" chunk:', e.message);
        }
      } else if (chunk.keyword === 'ccv3') {
        // Character Card V3 format
        try {
          const decoded = Buffer.from(chunk.text, 'base64').toString('utf-8');
          cardData = JSON.parse(decoded);
          this.context.utils.log.info('Found character card in "ccv3" chunk');
          break;
        } catch (e) {
          this.context.utils.log.warn('Failed to decode "ccv3" chunk:', e.message);
        }
      }
    }

    if (!cardData) {
      throw new Error('No character card data found in PNG');
    }

    // Normalize to V2 format
    return this.normalizeCard(cardData, filePath);
  }

  /**
   * Extract text chunks from PNG buffer
   * @param {Buffer} buffer - PNG file buffer
   * @returns {Array<{keyword: string, text: string}>}
   */
  extractTextChunks(buffer) {
    const chunks = [];
    let offset = 8; // Skip PNG signature

    while (offset < buffer.length) {
      // Read chunk length (4 bytes, big-endian)
      const length = buffer.readUInt32BE(offset);
      offset += 4;

      // Read chunk type (4 bytes)
      const type = buffer.subarray(offset, offset + 4).toString('ascii');
      offset += 4;

      // Read chunk data
      const data = buffer.subarray(offset, offset + length);
      offset += length;

      // Skip CRC (4 bytes)
      offset += 4;

      // Process text chunks
      if (type === 'tEXt') {
        // tEXt: keyword\0text
        const nullIndex = data.indexOf(0);
        if (nullIndex !== -1) {
          const keyword = data.subarray(0, nullIndex).toString('latin1');
          const text = data.subarray(nullIndex + 1).toString('latin1');
          chunks.push({ keyword, text, type: 'tEXt' });
        }
      } else if (type === 'zTXt') {
        // zTXt: keyword\0compression_method(1 byte)\0compressed_text
        const nullIndex = data.indexOf(0);
        if (nullIndex !== -1) {
          const keyword = data.subarray(0, nullIndex).toString('latin1');
          const compressionMethod = data[nullIndex + 1];
          const compressedData = data.subarray(nullIndex + 2);

          if (compressionMethod === 0) {
            try {
              const decompressed = zlib.inflateSync(compressedData).toString('utf-8');
              chunks.push({ keyword, text: decompressed, type: 'zTXt' });
            } catch (e) {
              this.context.utils.log.warn(`Failed to decompress zTXt chunk "${keyword}":`, e.message);
            }
          }
        }
      } else if (type === 'iTXt') {
        // iTXt: keyword\0compression_flag\0compression_method\0language_tag\0translated_keyword\0text
        const nullIndex = data.indexOf(0);
        if (nullIndex !== -1) {
          const keyword = data.subarray(0, nullIndex).toString('utf-8');
          const compressionFlag = data[nullIndex + 1];
          const compressionMethod = data[nullIndex + 2];

          // Find the text portion (after language tag and translated keyword)
          let textStart = nullIndex + 3;
          let nullCount = 0;
          while (textStart < data.length && nullCount < 2) {
            if (data[textStart] === 0) nullCount++;
            textStart++;
          }

          let text;
          if (compressionFlag === 1 && compressionMethod === 0) {
            try {
              text = zlib.inflateSync(data.subarray(textStart)).toString('utf-8');
            } catch (e) {
              this.context.utils.log.warn(`Failed to decompress iTXt chunk "${keyword}":`, e.message);
              continue;
            }
          } else {
            text = data.subarray(textStart).toString('utf-8');
          }

          chunks.push({ keyword, text, type: 'iTXt' });
        }
      }

      // Stop at IEND
      if (type === 'IEND') break;
    }

    return chunks;
  }

  /**
   * Normalize card data to V2 format
   * @param {object} cardData - Raw card data
   * @param {string} filePath - Path to source file
   * @returns {object} Normalized V2 card
   */
  normalizeCard(cardData, filePath) {
    // Check if already V2 format
    if (cardData.spec === 'chara_card_v2' && cardData.data) {
      return {
        ...cardData,
        data: {
          ...EMPTY_CARD.data,
          ...cardData.data,
          // Ensure tags is an array
          tags: Array.isArray(cardData.data.tags)
            ? cardData.data.tags
            : (typeof cardData.data.tags === 'string' && cardData.data.tags
                ? cardData.data.tags.split(',').map(t => t.trim())
                : []),
        },
        _source: filePath
      };
    }

    // Convert V1 format to V2
    this.context.utils.log.info('Converting V1 card to V2 format');

    return {
      spec: 'chara_card_v2',
      spec_version: '2.0',
      data: {
        name: cardData.name || cardData.char_name || '',
        description: cardData.description || cardData.char_persona || '',
        personality: cardData.personality || '',
        scenario: cardData.scenario || cardData.world_scenario || '',
        first_mes: cardData.first_mes || cardData.char_greeting || '',
        mes_example: cardData.mes_example || cardData.example_dialogue || '',
        creator_notes: cardData.creatorcomment || cardData.creator_notes || '',
        system_prompt: cardData.system_prompt || '',
        post_history_instructions: cardData.post_history_instructions || '',
        tags: Array.isArray(cardData.tags)
          ? cardData.tags
          : (typeof cardData.tags === 'string' && cardData.tags
              ? cardData.tags.split(',').map(t => t.trim())
              : []),
        creator: cardData.creator || '',
        character_version: cardData.character_version || '',
        alternate_greetings: cardData.alternate_greetings || [],
        extensions: cardData.extensions || {}
      },
      _source: filePath
    };
  }

  /**
   * Validate that a file is a valid character card
   * @param {string} filePath - Path to PNG file
   * @returns {Promise<boolean>}
   */
  async isValidCard(filePath) {
    try {
      const buffer = fs.readFileSync(filePath);
      const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

      if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
        return false;
      }

      const chunks = this.extractTextChunks(buffer);
      return chunks.some(c => c.keyword === 'chara' || c.keyword === 'ccv3');
    } catch {
      return false;
    }
  }
}

module.exports = CharacterCardParser;
