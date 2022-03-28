/**
 * @file      remove.command.ts
 * @brief     Remove an existing reaction role from a drop down menu.
 */

import {CommandInteraction, Role} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  DELETE_REACT_ROLE_BY_ROLE_ID,
  GET_REACT_ROLE_BY_ROLE_ID,
} from '../../database/database.js';
import {
  ReactMessageUpdate as EReactMessageUpdate,
  updateReactMessages,
} from '../../utils/discordx/reactions.js';
import EmbedService from '../../services/embed.service.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class ReactRemoveCommand {
  #embedService = new EmbedService();
  #permissionService = new PermissionService();

  @Slash('react-remove', {
    description: 'Remove an existing reaction role from a drop down menu.',
  })
  async execute(
    @SlashOption('role', {
      description: 'The reaction role you want deleted.',
      type: 'ROLE',
    })
    role: Role,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/react-` can only be used in a server.',
      });

    if (!this.#permissionService.canManageRoles(interaction.member))
      return await interaction
        .reply({
          ephemeral: true,
          content: "Hey! You don't have permission to use `/role-remove`.",
        })
        .catch(InteractionFailedHandler);

    if (!role) {
      log.error(
        'Interaction was missing role property despite it being required.'
      );
      return await interaction
        .reply({
          ephemeral: true,
          content:
            'Hey! For some reason I was unable to get the role that you told me to delete. Is it already deleted? Please try again. :)',
        })
        .catch(InteractionFailedHandler);
    }

    const reactRole = await GET_REACT_ROLE_BY_ROLE_ID(role.id);

    if (!reactRole) {
      log.debug(
        `User passed in role[${role.id}] that isn't in guilds reactRoles list.`
      );

      return await interaction
        .reply({
          ephemeral: true,
          content:
            "Hey! That role isn't in my system, perhaps you meant to pass in a different role?",
        })
        .catch(InteractionFailedHandler);
    }

    try {
      await DELETE_REACT_ROLE_BY_ROLE_ID(role.id);

      log.debug(
        `Successfully removed guilds[${interaction.guildId}] react role[${role.id}]`
      );

      const emojiMention = reactRole?.emojiTag ?? reactRole?.emojiId;

      await interaction
        .reply({
          ephemeral: true,
          content: `I successfully removed the react role (${emojiMention} - <@&${role.id}>)! You can add it back at any time if you wish.\n\nI'm gonna do some cleanup now and update any react role embed...`,
        })
        .catch(InteractionFailedHandler);

      if (reactRole.categoryId) {
        updateReactMessages(
          interaction.client,
          reactRole.categoryId,
          log,
          EReactMessageUpdate.reactRoleRemove,
          this.#embedService
        );
      }
    } catch (e) {
      log.error(
        `Error'd when trying to delete react role[${role.id}] on guild[${interaction.guildId}]`
      );
      log.error(`${e}`);

      interaction
        .reply({
          ephemeral: true,
          content:
            'Hey! I had an issue deleting that react role. Please wait a moment and try again.',
        })
        .catch(InteractionFailedHandler);
    }
  }
}
