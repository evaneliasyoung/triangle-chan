/**
 * @file      nuke.command.ts
 * @brief     This will remove ALL react roles for this server.
 */

import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import {ButtonComponent, Client, Discord, Slash} from 'discordx';
import {DELETE_ALL_REACT_ROLES_BY_GUILD_ID} from '../../database/database.js';
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
export abstract class ReactNukeCommand {
  #permissionService = new PermissionService();

  @ButtonComponent('react-nuke_confirm')
  async handleButton(interaction: ButtonInteraction, _client: Client) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: `Hey! For some reason Discord didn't send me your guild info. No longer nuking.`,
      });

    await interaction
      .reply({
        ephemeral: true,
        content: `Okay well, you asked for all react-roles to be deleted.`,
      })
      .catch(InteractionFailedHandler);

    DELETE_ALL_REACT_ROLES_BY_GUILD_ID(interaction.guildId)
      .then(async () => {
        log.debug(
          `User[${interaction.user.id}] removed ALL reactroles for guild[${interaction.guildId}]`
        );
        await interaction
          .followUp({
            ephemeral: true,
            content: `Hey! I deleted all your react roles. Any categories you had should still stand.`,
          })
          .catch(
            MessageWithErrorHandler(`Failed to send interaction followup.`)
          );
      })
      .catch(async e => {
        log.error(
          `Failed to delete react roles for guild[${interaction.guildId}]`,
          e
        );

        await interaction
          .followUp({
            ephemeral: true,
            content: `Hey! I had an issue deleting all the react roles.`,
          })
          .catch(
            MessageWithErrorHandler('Failed to send interaction followup.')
          );
      });
  }

  @Slash('react-nuke', {
    description: 'This will remove ALL react roles for this server.',
  })
  async execute(interaction: CommandInteraction) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/react-nuke` can only be used in a server.',
      });

    if (!this.#permissionService.canManageRoles(interaction.member))
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! You don't have permission to use \`/role-nuke\`.`,
        })
        .catch(InteractionFailedHandler);

    const buttons = new MessageActionRow({
      components: [
        new MessageButton({
          customId: 'react-nuke_confirm',
          label: 'Confirm Nuke',
          style: 'DANGER',
        }),
      ],
    });

    await interaction.reply({
      ephemeral: true,
      components: [buttons],
      content: `ARE YOU SURE YOU WANT TO DELETE ALL YOUR REACT ROLES?`,
    });
  }
}
