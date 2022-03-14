/**
 * @file      list.command.ts
 * @brief     List all reaction roles that are currently active.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
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
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class ReactListCommand {
  #embedService = new EmbedService();

  @Slash('react-list', {
    description: 'List all reaction roles that are currently active.',
  })
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand() || !interaction.guildId) return;

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
          content: `Hey! Turns out this server doesn't have any react roles setup. Start creating some with \`/react-role\`!`,
        })
        .catch(InteractionFailedHandler);

    await interaction
      .reply({
        content: `Hey! Here's your react roles.`,
        embeds: [this.#embedService.reactRoleListEmbed(reactRoles)],
      })
      .catch(InteractionFailedHandler);
  }
}
