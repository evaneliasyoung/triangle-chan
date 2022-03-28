/**
 * @file      range.command.ts
 * @brief     Generates a random number between two values.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {math} from '../../utils/native/math.js';

@Discord()
export default abstract class RandomRangeCommand {
  @Slash('random-range', {description: 'generates a random number'})
  async execute(
    @SlashOption('min', {description: 'minimum random number', type: 'INTEGER'})
    min: number,
    @SlashOption('max', {description: 'maximum random number', type: 'INTEGER'})
    max: number,
    interaction: CommandInteraction
  ) {
    await interaction.reply(
      `Here's a random ${math.random.integer(min, max)}!`
    );
  }
}
