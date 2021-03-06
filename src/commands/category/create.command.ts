/**
 * @file      create.command.ts
 * @brief     Create a new category to categorize your reaction roles in..
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  GET_CATEGORY_BY_NAME,
  CREATE_GUILD_CATEGORY,
} from '../../database/database.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CategoryCreateCommand {
  #permissionService = new PermissionService();

  @Slash('category-create', {
    description: 'Create a new category to categorize your reaction roles in.',
  })
  async execute(
    @SlashOption('name', {
      description: 'The name of the category.',
      type: 'STRING',
    })
    name: string,
    @SlashOption('description', {
      description: 'Give your category a description.',
      type: 'STRING',
      required: false,
    })
    description: string | null,
    @SlashOption('mutually-exclusive', {
      description: 'Make roles from this category mutually exclusive.',
      type: 'BOOLEAN',
      required: false,
    })
    mutuallyExclusive: boolean | null,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/category-create` can only be used in a server.',
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

    if (!name)
      return await interaction
        .reply({
          ephemeral: true,
          content:
            'Hey! It says you submitted no category name! You need to submit that. Please try again.',
        })
        .catch(InteractionFailedHandler);
    else if (name.length > 90)
      return await interaction
        .reply({
          ephemeral: true,
          content:
            'Hey! Discord only allows 100 characters max for their embed titles. Try making the category name simple and make the rest the category description!',
        })
        .catch(InteractionFailedHandler);

    if (await GET_CATEGORY_BY_NAME(interaction.guildId, name))
      return await interaction
        .reply(
          'Hey! It turns out you already have a category with that name made. Try checking it out.'
        )
        .catch(InteractionFailedHandler);

    CREATE_GUILD_CATEGORY(
      interaction.guildId,
      name,
      description,
      mutuallyExclusive
    )
      .then(async () => {
        log.debug(
          `Successfully created category[${name}] for guild[${interaction.guildId}]`
        );
        await interaction
          .reply(
            `Hey! I successfully created the category \`${name}\` for you!`
          )
          .catch(InteractionFailedHandler);
      })
      .catch(async e => {
        log.error(
          `Issue creating category[${name}] for guild[${interaction.guildId}]`,
          e
        );

        await interaction
          .reply(
            'Hey! I had some trouble creating that category for you. Please wait a minute and try again.'
          )
          .catch(InteractionFailedHandler);
      });
  }
}
