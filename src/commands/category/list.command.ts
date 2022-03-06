/**
 * @file      list.command.ts
 * @brief     List all your categories and the roles within them.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { GET_GUILD_CATEGORIES, GET_REACT_ROLES_NOT_IN_CATEGORIES } from '../../database/database.js';
import { EmbedService } from '../../services/embed.service.js';
import { logger } from '../../services/log.service.js';
import { spliceIntoChunks } from '../../utils/splice-into-chunks.js';
const log = logger(import.meta);

@Discord()
export abstract class CategoryListCommand {
  @Slash('category-list', { description: 'List all your categories and the roles within them.' })
  async execute(
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId) return log.error(`GuildID did not exist on interaction.`);

    const categories = await GET_GUILD_CATEGORIES(interaction.guildId).catch((e) => {
      log.error(`Failed to get categories for guild[${interaction.guildId}]`);
      log.error(e);
    });

    if (!categories || !categories.length) {
      log.debug(`Guild[${interaction.guildId}] did not have any categories.`);
      return await interaction
        .reply(`Hey! It appears that there aren't any categories for this server... however, if there ARE supposed to be some and you see this please wait a second and try again.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    await interaction
      .reply(`Hey! Let me build these embeds for you real quick and send them...`)
      .catch((e) => {
        log.error(`Interaction failed.`);
        log.error(`${e}`);
      });
    const embeds: MessageEmbed[] = [];

    const rolesNotInCategory = await GET_REACT_ROLES_NOT_IN_CATEGORIES(interaction.guildId);
    if (rolesNotInCategory.length) embeds.push(await EmbedService.freeReactRoles(rolesNotInCategory));

    for (const cat of categories) embeds.push(await EmbedService.categoryReactRoleEmbed(cat));

    for (const chunk of spliceIntoChunks(embeds, 10)) {
      interaction.channel
        ?.send({ embeds: chunk })
        .catch(() =>
          log.error(`Failed to send category embeds to channel[${interaction.channel?.id}] in guild[${interaction.guildId}]`)
        );
    }
  };
}
