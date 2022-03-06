/**
 * @file      create.command.ts
 * @brief     Create a new category to categorize your reaction roles in..
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { GET_CATEGORY_BY_NAME, CREATE_GUILD_CATEGORY } from '../../database/database.js';
import { logger } from '../../services/log.service.js';
const log = logger(import.meta);

@Discord()
export abstract class CategoryCreateCommand {
  @Slash('category-create', { description: 'Create a new category to categorize your reaction roles in.' })
  async execute(
    @SlashOption('category-name', { description: 'The name of the category.', type: 'STRING' })
    categoryName: string,
    @SlashOption('category-desc', { description: 'Give your category a description.', type: 'STRING', required: false })
    categoryDesc: string | null,
    @SlashOption('mutually-exclusive', { description: 'Make roles from this category mutually exclusive.', type: 'BOOLEAN', required: false })
    mutuallyExclusive: boolean | null,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId) return log.error(`GuildID did not exist on interaction.`);

    if (!categoryName)
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! It says you submitted no category name! You need to submit that. Please try again.`,
        })
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    else if (categoryName.length > 90)
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! Discord only allows 100 characters max for their embed titles. Try making the category name simple and make the rest the category description!`,
        })
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });

    if (await GET_CATEGORY_BY_NAME(interaction.guildId, categoryName))
      return await interaction
        .reply(`Hey! It turns out you already have a category with that name made. Try checking it out.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });


    CREATE_GUILD_CATEGORY(interaction.guildId, categoryName, categoryDesc ?? undefined, !!mutuallyExclusive)
      .then(async () => {
        log.debug(`Successfully created category[${categoryName}] for guild[${interaction.guildId}]`);
        await interaction
          .reply(`Hey! I successfully created the category \`${categoryName}\` for you!`)
          .catch((e) => {
            log.error(`Interaction failed.`);
            log.error(`${e}`);
          });
      })
      .catch(async e => {
        log.error(`Issue creating category[${categoryName}] for guild[${interaction.guildId}]`);
        log.error(e);

        await interaction
          .reply(`Hey! I had some trouble creating that category for you. Please wait a minute and try again.`)
          .catch(e => {
            log.error(`Interaction failed.`);
            log.error(`${e}`);
          });
      });
  };
}
