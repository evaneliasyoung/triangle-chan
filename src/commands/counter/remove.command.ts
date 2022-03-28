/**
 * @file      remove.command.ts
 * @brief     Removes the counters from the voice channels.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {DELETE_COUNTER_BY_NAME} from '../../database/database.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CounterRemoveCommand {
  #permissionService = new PermissionService();

  @Slash('counter-remove', {
    description: 'Removes the counters from the voice channels.',
  })
  async execute(
    @SlashOption('name', {
      description:
        'The name of the counter, this is case sensitive and used to find your counter.',
      type: 'STRING',
    })
    name: string,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/counter-remove` can only be used in a server.',
      });

    if (!this.#permissionService.canManageChannels(interaction.member))
      return await interaction
        .reply({
          ephemeral: true,
          content: "Hey! You don't have permission to use `/counter-create`.",
        })
        .catch(InteractionFailedHandler);

    if (!name) {
      log.error('Required option name was undefined.');
      return await interaction
        .reply({
          ephemeral: true,
          content:
            'Hey! I had an issue finding the counter. Please wait a second and try again.',
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
        .reply("I'm having trouble removing the counter.")
        .catch(InteractionFailedHandler);
    }
  }
}
