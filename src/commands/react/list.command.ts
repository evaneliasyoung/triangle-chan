/**
 * @file      list.command.ts
 * @brief     List all reaction roles that are currently active.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash} from 'discordx';
import {GET_REACT_ROLES_BY_GUILD_ID} from '../../database/database.js';
import EmbedService from '../../services/embed.service.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
  MessageWithErrorHandlerGenerator,
} from '../../services/log.service.js';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class ReactListCommand {
  #embedService = new EmbedService();
  #permissionService = new PermissionService();

  @Slash('react-list', {
    description: 'List all reaction roles that are currently active.',
  })
  async execute(interaction: CommandInteraction) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/react-list` can only be used in a server.',
      });

    if (!this.#permissionService.canManageRoles(interaction.member))
      return await interaction
        .reply({
          ephemeral: true,
          content: "Hey! You don't have permission to use `/react-list`.",
        })
        .catch(InteractionFailedHandler);

    const reactRoles = await GET_REACT_ROLES_BY_GUILD_ID(
      interaction.guildId
    ).catch(
      MessageWithErrorHandler(
        `Failed to fetch react roles for guild[${interaction.guildId}]`
      )
    );

    if (!reactRoles || !reactRoles.length)
      return await interaction
        .reply({
          content:
            "Hey! Turns out this server doesn't have any react roles setup. Start creating some with `/react-role`!",
        })
        .catch(InteractionFailedHandler);

    await interaction
      .reply({
        content: "Hey! Here's your react roles.",
        embeds: [this.#embedService.reactRoleListEmbed(reactRoles)],
      })
      .catch(InteractionFailedHandler);
  }
}
