/**
 * @file      edit.command.ts
 * @brief     Edit any category's name, description, or if it's mutually exclusive.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-08
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { GET_CATEGORY_BY_NAME, EDIT_CATEGORY_BY_ID } from '../../database/database.js';
import { ICategory } from '../../database/entities/category.entity.js';
import { InteractionFailedHandlerGenerator, logger } from '../../services/log.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CategoryEditCommand {
  @Slash('category-edit', { description: `Edit any category's name, description, or if it's mutually exclusive.` })
  async execute(
    @SlashOption('name', { description: 'The name of the category, this is case sensitive and used to find your category.', type: 'STRING' })
    name: string,
    @SlashOption('new-name', { description: 'Change the name of the category. This is the title of the embed.', type: 'STRING', required: false })
    newName: string | null,
    @SlashOption('new-description', { description: 'Change the description. This is shown above your react roles in the embed.', type: 'STRING', required: false })
    newDesc: string | null,
    @SlashOption('mutually-exclusive', { description: 'Change if roles in this category should be mutually exclusive.', type: 'BOOLEAN', required: false })
    mutuallyExclusive: boolean | null,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId) return log.error(`GuildID did not exist on interaction.`);

    if (!newName && !newDesc && mutuallyExclusive === null) {
      log.debug(`User didn't change anything about the category`);
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! You need to pass at _least_ one updated field about the category.`,
        })
        .catch(InteractionFailedHandler);
    }

    if (!name) {
      log.error(`Required option name was undefined.`);
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I had an issue finding the category. Please wait a second and try again.`,
        })
        .catch(InteractionFailedHandler);
    }

    const category = await GET_CATEGORY_BY_NAME(interaction.guildId, name);
    if (!category) {
      log.debug(`Category not found with name[${name}] in guild[${interaction.guildId}]`);

      return await interaction
        .reply(`Hey! I couldn't find a category with that name. The name is _case sensitive_ so make sure it's typed correctly.`)
        .catch(InteractionFailedHandler);
    }

    const updatedCategory: Partial<ICategory> = {
      name: newName ?? category.name,
      description: newDesc ?? category.description,
      mutuallyExclusive: mutuallyExclusive ?? category.mutuallyExclusive,
    };

    EDIT_CATEGORY_BY_ID(category.id, updatedCategory)
      .then(async () => {
        log.info(`Updated category[${category.id}] in guild[${interaction.guildId}] successfully.`);

        await interaction
          .reply({
            ephemeral: true,
            content: `Hey! I successfully updated the category \`${category.name}\` for you.`,
          })
          .catch(InteractionFailedHandler);
      })
      .catch(InteractionFailedHandler);
  };
}
