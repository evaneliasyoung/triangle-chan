/**
 * @file      range.command.ts
 * @brief     Generates a random number between two values.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-12
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {Random} from '../../utils/native/random.js';

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
    await interaction.reply(`Here's a random ${Random.integer(min, max)}!`);
  }
}
