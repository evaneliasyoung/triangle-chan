/**
 * @file      list.command.ts
 * @brief     List all your categories and the roles within them.
 */

import {CommandInteraction, MessageEmbed} from 'discord.js';
import {Discord, Slash} from 'discordx';
import {
  GET_GUILD_CATEGORIES,
  GET_REACT_ROLES_NOT_IN_CATEGORIES,
} from '../../database/database.js';
import EmbedService from '../../services/embed.service.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
  MessageWithErrorHandlerGenerator,
} from '../../services/log.service.js';
import PermissionService from '../../services/permission.service.js';
import {chunk} from '../../utils/native/chunk.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CategoryListCommand {
  #embedService = new EmbedService();
  #permissionService = new PermissionService();

  @Slash('category-list', {
    description: 'List all your categories and the roles within them.',
  })
  async execute(interaction: CommandInteraction) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/category-list` can only be used in a server.',
      });

    const {member} = interaction;
    if (!this.#permissionService.canManageRoles(member))
      return await interaction
        .reply({
          ephemeral: true,
          content:
            "Hey! You don't have permission to use `/category-create` command.",
        })
        .catch(InteractionFailedHandler);

    const categories = await GET_GUILD_CATEGORIES(interaction.guildId).catch(
      MessageWithErrorHandler(
        `Failed to get categoies for guild[${interaction.guildId}]`
      )
    );

    if (!categories || !categories.length) {
      log.debug(`Guild[${interaction.guildId}] did not have any categories.`);
      return await interaction
        .reply(
          "Hey! It appears that there aren't any categories for this server... however, if there ARE supposed to be some and you see this please wait a second and try again."
        )
        .catch(InteractionFailedHandler);
    }

    await interaction
      .reply(
        'Hey! Let me build these embeds for you real quick and send them...'
      )
      .catch(InteractionFailedHandler);

    const rolesNotInCategory = await GET_REACT_ROLES_NOT_IN_CATEGORIES(
      interaction.guildId
    );
    const embeds: MessageEmbed[] = [
      await this.#embedService.freeReactRoles(rolesNotInCategory),
      ...(await Promise.all(
        categories.map(this.#embedService.categoryReactRoleEmbed)
      )),
    ];

    for (const embed of chunk(embeds, 10)) {
      interaction.channel
        ?.send({embeds: embed})
        .catch(() =>
          log.error(
            `Failed to send category embeds to channel[${interaction.channel?.id}] in guild[${interaction.guildId}]`
          )
        );
    }
  }
}
