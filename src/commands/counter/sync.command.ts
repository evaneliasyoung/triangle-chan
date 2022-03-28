/**
 * @file      sync.command.ts
 * @brief     Syncs the counts of the counter channels.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash} from 'discordx';
import CounterService from '../../services/counter.service.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CounterSyncCommand {
  #counterService = new CounterService();
  #permissionService = new PermissionService();

  @Slash('counter-sync', {
    description: 'Syncs the counts of the counter channels.',
  })
  async execute(interaction: CommandInteraction) {
    const {guild} = interaction;
    if (!guild)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/counter-` can only be used in a server.',
      });

    if (!this.#permissionService.canManageChannels(interaction.member))
      return await interaction
        .reply({
          ephemeral: true,
          content: "Hey! You don't have permission to use `/counter-create`.",
        })
        .catch(InteractionFailedHandler);

    try {
      await this.#counterService.handleGuild(guild);
      await interaction
        .reply('Hey! I synced those counter channels for you!')
        .catch(InteractionFailedHandler);
    } catch (e) {
      log.debug('Failed to sync counters.', e);
      await interaction
        .reply("I'm having trouble syncing the counters.")
        .catch(InteractionFailedHandler);
    }
  }
}
