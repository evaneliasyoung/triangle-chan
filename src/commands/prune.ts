/**
 * @file      prune.ts
 * @brief     Removes the most recent messages.
 *
 * @author    Evan Elias Young
 * @date      2022-03-13
 * @date      2022-03-13
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {logger} from '../services/log.service.js';
const log = logger(import.meta);

@Discord()
export abstract class PruneCommand {
  @Slash('prune', {description: 'Removes the most recent messages.'})
  async prune(
    @SlashOption('amount', {
      type: 'INTEGER',
      minValue: 1,
      maxValue: 100,
      required: false,
    })
    amount: number = 1,
    interaction: CommandInteraction
  ) {
    if (!interaction.channel)
      return log.debug('no channel on interaction', {interaction});
    const prior = await interaction.channel?.messages.fetch({
      before: interaction.id,
      limit: amount,
    });
    if (prior) {
      await interaction.reply({
        ephemeral: true,
        content: `:radio_button:  |  Deleting the last ${prior.size} messages...`,
      });
      await Promise.all(prior.map(msg => msg.delete()));
      await interaction.editReply({
        content: `:ballot_box_with_check:  |  Deleted the last ${prior.size} messages...`,
      });
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `:warning:  |  Failed to find the last ${amount} messages...`,
      });
    }
  }
}
