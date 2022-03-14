/**
 * @file      prune.ts
 * @brief     Removes the most recent messages.
 *
 * @author    Evan Elias Young
 * @date      2022-03-13
 * @date      2022-03-14
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../services/log.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

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
    if (!interaction.guildId)
      return await interaction
        .reply({
          ephemeral: true,
          content: 'Hey! `/role-appoint` can only be used in a server.',
        })
        .catch(InteractionFailedHandler);

    if (!interaction.channel)
      return log.debug('no channel on interaction', {interaction});

    const prior = await interaction.channel?.messages.fetch({
      before: interaction.id,
      limit: amount,
    });
    if (prior) {
      await interaction
        .reply({
          ephemeral: true,
          content: `Deleting the last ${prior.size} messages...`,
        })
        .catch(InteractionFailedHandler);
      await Promise.all(prior.map(msg => msg.delete()));
      await interaction
        .editReply({
          content: `I deleted the last ${prior.size} messages...`,
        })
        .catch(InteractionFailedHandler);
    } else {
      await interaction
        .reply({
          ephemeral: true,
          content: `Failed to delete the last ${amount} messages...`,
        })
        .catch(InteractionFailedHandler);
    }
  }
}
