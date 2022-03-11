/**
 * @file      sync.command.ts
 * @brief     Syncs the counts of the counter channels.
 *
 * @author    Evan Elias Young
 * @date      2022-03-10
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import CounterService from '../../services/counter.service.js';
import { InteractionFailedHandlerGenerator, logger } from '../../services/log.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CounterSyncCommand {
  #counterService = new CounterService();

  @Slash('counter-sync', { description: 'Syncs the counts of the counter channels.' })
  async execute(
    interaction: CommandInteraction
  ) {
    const { guild, guildId } = interaction;
    if (!guildId) return log.error(`GuildID did not exist on interaction.`);
    if (!guild) return log.error('Guild did not exist on interaction.');

    try {
      await this.#counterService.handleGuild(guild);
      await interaction
        .reply('Hey! I synced those counter channels for you!')
        .catch(InteractionFailedHandler);
    } catch (e) {
      log.debug('Failed to sync counters.', e);
      await interaction
        .reply(`I'm having trouble syncing the counters.`)
        .catch(InteractionFailedHandler);
    }

  }
}
