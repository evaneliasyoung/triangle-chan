/**
 * @file      corrupt.command.ts
 * @brief     Corrupts your text (Zalgo text).
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
import {Random} from '../../utils/native/random.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class TextCorruptCommand {
  static slots = ['above', 'middle', 'below'] as const;
  static chars: Record<typeof TextCorruptCommand.slots[number], string[]> = {
    above: [
      '̍',
      '̎',
      '̄',
      '̅',
      '̿',
      '̑',
      '̆',
      '̐',
      '͒',
      '͗',
      '͑',
      '̇',
      '̈',
      '̊',
      '͂',
      '̓',
      '̈́',
      '͊',
      '͋',
      '͌',
      '̃',
      '̂',
      '̌',
      '͐',
      '̀',
      '́',
      '̋',
      '̏',
      '̒',
      '̓',
      '̔',
      '̽',
      '̉',
      'ͣ',
      'ͤ',
      'ͥ',
      'ͦ',
      'ͧ',
      'ͨ',
      'ͩ',
      'ͪ',
      'ͫ',
      'ͬ',
      'ͭ',
      'ͮ',
      'ͯ',
      '̾',
      '͛',
      '͆',
      '̚',
    ],
    middle: [
      '̕',
      '̛',
      '̀',
      '́',
      '͘',
      '̡',
      '̢',
      '̧',
      '̨',
      '̴',
      '̵',
      '̶',
      '͏',
      '͜',
      '͝',
      '͞',
      '͟',
      '͠',
      '͢',
      '̸',
      '̷',
      '͡',
      '҉',
    ],
    below: [
      '̖',
      '̗',
      '̘',
      '̙',
      '̜',
      '̝',
      '̞',
      '̟',
      '̠',
      '̤',
      '̥',
      '̦',
      '̩',
      '̪',
      '̫',
      '̬',
      '̭',
      '̮',
      '̯',
      '̰',
      '̱',
      '̲',
      '̳',
      '̹',
      '̺',
      '̻',
      '̼',
      'ͅ',
      '͇',
      '͈',
      '͉',
      '͍',
      '͎',
      '͓',
      '͔',
      '͕',
      '͖',
      '͙',
      '͚',
      '̣',
    ],
  };

  @Slash('text-corrupt', {description: 'Corrupts your text (Zalgo text).'})
  async execute(
    @SlashOption('text', {description: 'The text you want to corrupt.'})
    text: string,
    interaction: CommandInteraction
  ) {
    let buf: string = '';

    for (let c of text) {
      buf += c;
      if (c === ' ' || c.length > 1) {
        continue;
      }

      TextCorruptCommand.slots.forEach(key => {
        const amt: number = Random.integer(0, key === 'middle' ? 2 : 4);
        for (let i = 0; i < amt; ++i) {
          buf += Random.pick(...TextCorruptCommand.chars[key]);
        }
      });
    }

    await interaction
      .reply(`Here you go!\n${buf}`)
      .catch(InteractionFailedHandler);
  }
}
