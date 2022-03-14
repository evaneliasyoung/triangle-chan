/**
 * @file      flip.command.ts
 * @brief     Flips a coin which lands heads or tails.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-12
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash} from 'discordx';
import {Random} from '../../utils/native/random.js';

@Discord()
abstract class RandomFlipCommand {
  @Slash('random-flip', {
    description: 'Flips a coin which lands heads or tails.',
  })
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      `The coin landed ${Random.boolean() ? 'heads' : 'tails'}!`
    );
  }
}
