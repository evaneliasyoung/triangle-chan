/**
 * @file      remove.command.ts
 * @brief     Delete a category. Deleting a category frees all roles it contains..
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { GET_CATEGORY_BY_NAME, DELETE_CATEGORY_BY_ID, GET_REACT_ROLES_BY_CATEGORY_ID } from '../../database/database.js';
import { logger } from '../../services/log.service.js';
const log = logger(import.meta);

@Discord()
export abstract class CategoryRemoveCommand {
  @Slash('category-remove', { description: 'Delete a category. Deleting a category frees all roles it contains.' })
  async execute(
    @SlashOption('category-name', { description: 'Name of the category you want to delete.' })
    categoryName: string,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId) return log.error(`GuildID did not exist on interaction.`);

    if (!categoryName) {
      log.debug(`Required option was empty for categoryName[${categoryName}] on guild[${interaction.guildId}]`);
      return await interaction
        .reply(`Hey! I don't think you passed in a name. Could you please try again?`)
        .catch(e => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const category = await GET_CATEGORY_BY_NAME(interaction.guildId, categoryName);
    if (!category) {
      log.debug(`Category[${categoryName}] does not exist on guild[${interaction.guildId}]. Most likely name typo.`);
      return await interaction
        .reply(`Hey! I could **not** find a category by the name of \`${categoryName}\`. This command is case sensitive to ensure you delete exactly what you want. Check the name and try again.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const roles = await GET_REACT_ROLES_BY_CATEGORY_ID(category.id);
    await Promise.all(roles.map(role => { role.categoryId = undefined; return role.save(); }));

    DELETE_CATEGORY_BY_ID(category.id)
      .then(async () => {
        log.debug(`Successfully deleted category[${categoryName}] for guild[${interaction.guildId}]`);

        await interaction
          .reply(`Hey! I successfully deleted the category \`${categoryName}\` for you and freed all the roles on it.`)
          .catch((e) => {
            log.error(`Interaction failed.`);
            log.error(`${e}`);
          });
      })
      .catch(async e => {
        log.error(`Issues deleting category[${categoryName}] for guild[${interaction.guildId}]`);
        log.error(e);

        await interaction
          .reply(`Hey! I had an issue deleting the category. Please wait a second and try again.`)
          .catch(e => {
            log.error(`Interaction failed.`);
            log.error(`${e}`);
          });
      });
  };
}
