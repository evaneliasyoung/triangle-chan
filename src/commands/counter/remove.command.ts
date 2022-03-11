/**
 * @file      remove.command.ts
 * @brief     Removes the counters from the voice channels.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { DELETE_COUNTER_BY_NAME } from '../../database/database.js';
import CounterService from '../../services/counter.service.js';
import { InteractionFailedHandlerGenerator, logger } from '../../services/log.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CounterRemoveCommand {
  #counterService = new CounterService();

  @Slash('counter-remove', { description: 'Removes the counters from the voice channels.' })
  async execute(
    @SlashOption('name', { description: 'The name of the counter, this is case sensitive and used to find your counter.', type: 'STRING' })
    name: string,
    interaction: CommandInteraction
  ) {
    const { guild, guildId } = interaction;
    if (!guildId) return log.error(`GuildID did not exist on interaction.`);
    if (!guild) return log.error('Guild did not exist on interaction.');

    if (!name) {
      log.error(`Required option name was undefined.`);
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I had an issue finding the counter. Please wait a second and try again.`,
        })
        .catch(InteractionFailedHandler);
    }

    try {
      await DELETE_COUNTER_BY_NAME(name);
      await interaction
        .reply(`Hey! I removed the \`${name}\` counter for you!`)
        .catch(InteractionFailedHandler);
    } catch (e) {
      log.debug('Failed to sync counters.', e);
      await interaction
        .reply(`I'm having trouble removing the counter.`)
        .catch(InteractionFailedHandler);
    }
  }
}
