/**
 * @file      remove.command.ts
 * @brief     Delete a category. Deleting a category frees all roles it contains..
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  GET_CATEGORY_BY_NAME,
  DELETE_CATEGORY_BY_ID,
  FREE_ROLES_BY_CATEGORY_ID,
} from '../../database/database.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CategoryRemoveCommand {
  #permissionService = new PermissionService();

  @Slash('category-remove', {
    description:
      'Delete a category. Deleting a category frees all roles it contains.',
  })
  async execute(
    @SlashOption('name', {
      description: 'Name of the category you want to delete.',
    })
    name: string,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/category-remove` can only be used in a server.',
      });

    const {member} = interaction;
    if (!this.#permissionService.canManageRoles(member))
      return await interaction
        .reply({
          ephemeral: true,
          content:
            "Hey! You don't have permission to use `/category-add` command.",
        })
        .catch(InteractionFailedHandler);

    if (!name) {
      log.debug(
        `Required option was empty for name[${name}] on guild[${interaction.guildId}]`
      );
      return await interaction
        .reply(
          "Hey! I don't think you passed in a name. Could you please try again?"
        )
        .catch(InteractionFailedHandler);
    }

    const category = await GET_CATEGORY_BY_NAME(interaction.guildId, name);
    if (!category) {
      log.debug(
        `Category[${name}] does not exist on guild[${interaction.guildId}]. Most likely name typo.`
      );
      return await interaction
        .reply(
          `Hey! I could **not** find a category by the name of \`${name}\`. This command is case sensitive to ensure you delete exactly what you want. Check the name and try again.`
        )
        .catch(InteractionFailedHandler);
    }

    await FREE_ROLES_BY_CATEGORY_ID(category.id);

    DELETE_CATEGORY_BY_ID(category.id)
      .then(async () => {
        log.debug(
          `Successfully deleted category[${name}] for guild[${interaction.guildId}]`
        );

        await interaction
          .reply(
            `Hey! I successfully deleted the category \`${name}\` for you and freed all the roles on it.`
          )
          .catch(InteractionFailedHandler);
      })
      .catch(async e => {
        log.error(
          `Issues deleting category[${name}] for guild[${interaction.guildId}]`,
          e
        );

        await interaction
          .reply(
            'Hey! I had an issue deleting the category. Please wait a second and try again.'
          )
          .catch(InteractionFailedHandler);
      });
  }
}
