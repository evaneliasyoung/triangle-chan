/**
 * @file      flip.command.ts
 * @brief     Flips a coin which lands heads or tails.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash} from 'discordx';
import {math} from '../../utils/native/math.js';

@Discord()
export default abstract class RandomFlipCommand {
  @Slash('random-flip', {
    description: 'Flips a coin which lands heads or tails.',
  })
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      `The coin landed ${math.random.boolean() ? 'heads' : 'tails'}!`
    );
  }
}
