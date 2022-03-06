/**
 * @file      list.command.ts
 * @brief     List all reaction roles that are currently active.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { GET_REACT_ROLES_BY_GUILD } from '../../database/database.js';
import { EmbedService } from '../../services/embed.service.js';
import { logger } from '../../services/log.service.js';
const log = logger(import.meta);

@Discord()
export abstract class ReactListCommand {
  @Slash('react-list', { description: 'List all reaction roles that are currently active.' })
  async execute(
    interaction: CommandInteraction
  ) {
    if (!interaction.isCommand() || !interaction.guildId) return;

    const reactRoles = await GET_REACT_ROLES_BY_GUILD(interaction.guildId).catch((e) => {
      log.error(`Failed to fetch react roles for guild[${interaction.guildId}]`);
      log.error(`${e}`);
    });

    if (!reactRoles || !reactRoles.length)
      return interaction
        .reply({ content: `Hey! Turns out this server doesn't have any react roles setup. Start creating some with \`/react-role\`!`, })
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });

    interaction
      .reply({
        content: `Hey! Here's your react roles.`,
        embeds: [EmbedService.reactRoleListEmbed(reactRoles)],
      })
      .catch((e) => {
        log.error(`Interaction failed.`);
        log.error(`${e}`);
      });
  };
}
