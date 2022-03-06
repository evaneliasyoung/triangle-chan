/**
 * @file      add.command.ts
 * @brief     Add reaction roles to a specific category.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { GET_REACT_ROLE_BY_ID, GET_CATEGORY_BY_ID, GET_REACT_ROLES_NOT_IN_CATEGORIES, GET_REACT_ROLES_BY_CATEGORY_ID, UPDATE_REACT_ROLE_CATEGORY, GET_GUILD_CATEGORIES } from '../../database/database.js';
import { ReactRole } from '../../database/entities/index.js';
import { logger } from '../../services/log.service.js';
import { spliceIntoChunks } from '../../utils/splice-into-chunks.js';
const log = logger(import.meta);

@Discord()
export abstract class CategoryAddCommand {
  handleButton = async (interaction: ButtonInteraction, args: string[]) => {
    if (!interaction.guildId) {
      return log.error(`GuildID did not exist on interaction.`);
    }

    const [reactRoleId, categoryId] = args;

    const reactRole = await GET_REACT_ROLE_BY_ID(Number(reactRoleId));
    const category = await GET_CATEGORY_BY_ID(Number(categoryId));

    const categorilessRoles = ((await GET_REACT_ROLES_NOT_IN_CATEGORIES(interaction.guildId)) ?? []).filter((r) => r.roleId !== reactRole?.roleId);

    const categoryRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(Number(categoryId)).catch((e) => {
      log.error(`Failed to get react roles with categoryId[${categoryId}] for guild[${interaction.guildId}]`);
      log.error(`${e}`);
    });

    if (!categoryRoles) {
      log.error(`Unable to find category roles for category[${categoryId}] in guild[${interaction.guildId}]`);
      return await interaction.reply(`Hey! Something broke. But I'm working on it, please be patient!`);
    }

    if (!reactRole) {
      log.error(`React role[${reactRoleId}] was not found with the given ID.`);

      return await interaction
        .reply(`Hey! Something weird happened so I couldn't complete that request for you. Please wait a second and try again.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    if (!category) {
      log.error(`Category[${categoryId}] was not found with the given ID.`);

      return await interaction
        .reply(`Hey! Something weird happened so I couldn't complete that request for you. Please wait a second and try again.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    if (categoryRoles.length >= 20) {
      log.debug(`Category[${categoryId}] already has 20 react roles in it.`);
      return await interaction.reply(`Hey! Category \`${category.name}\` already has the max of 20 react roles. This is due to Discords reaction limitation. Make another category!`);
    }

    if (reactRole.categoryId) {
      const reactRoleCategory = await GET_CATEGORY_BY_ID(reactRole.categoryId);
      log.debug(`React role[${reactRoleId}] is already in a category[${categoryId}]`);

      await interaction
        .reply(`Hey! This role is already in the category \`${reactRoleCategory?.name}\`.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const roleButtons = await this.buildReactRoleButtons(categorilessRoles, Number(categoryId));

    try {
      await UPDATE_REACT_ROLE_CATEGORY(Number(reactRoleId), Number(categoryId));
      const moreRoles = `I've added \`${reactRole.name}\` to \`${category.name}\`, you can add more roles if you wish.`;
      const noRolesLeft = `I've added \`${reactRole.name}\` to \`${category.name}\`. If you want to add more you need to create more react roles first.`;

      interaction
        .update({
          content: roleButtons.length ? moreRoles : noRolesLeft,
          components: roleButtons,
        })
        .catch((e) => {
          log.error(`Failed to update interaction`);
          log.error(`${e}`);
        });

      log.debug(`Successfully updated roles[${reactRoleId}] categoryId[${categoryId}]`);
    } catch (e) {
      log.error(`Failed to update roles[${reactRoleId}] categoryId[${categoryId}]`);
      log.error(`${e}`);
      interaction.update({
        content: `Hey! I had an issue adding \`${reactRole.name}\` to the category \`${category.name}\`. Please wait a second and try again.`,
      });
    }
  };

  handleSelect = async (interaction: SelectMenuInteraction, args: string[]) => {
    const [guildId, categoryId] = args;
    const category = await GET_CATEGORY_BY_ID(Number(categoryId));
    if (!category) {
      log.error(`Could not find category[${categoryId}] after it was selected in dropdown.`);
      return interaction
        .reply(`Hey! The category you selected... I can't find it. Does it exist anymore? Please wait a second and try running \`/category-add\` again.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const reactRoles = await GET_REACT_ROLES_NOT_IN_CATEGORIES(guildId);
    const roleButtons = await this.buildReactRoleButtons(reactRoles, category.id);

    await interaction
      .update({
        content: `Below are reaction roles and their respective emojis. Click the buttons you want to add to the category \`${category.name}\`.`,
        components: roleButtons,
      })
      .catch((e) => {
        log.error(`Failed to send category[${category.id}] buttons for guild[${interaction.guildId}]`);
        log.error(`${e}`);
        interaction.channel
          ?.send(`Hey! I had an issue making some buttons for you. I suspect that one of the react role emojis isn't actually an emoji. Check out \`/react-list\` to confirm this.`)
          .catch((e) => {
            log.error(`Failed to warn user about emojis buttons`);
            log.error(`${e}`);
          });
      });
  };

  private buildReactRoleButtons = async (reactRoles: ReactRole[], categoryId: number) =>
    spliceIntoChunks(reactRoles, 5).map((chunk) =>
      new MessageActionRow({
        components: chunk.map((r, i) =>
          new MessageButton({
            customId: `category-add_${r.id}-${categoryId}`,
            emoji: r.emojiId,
            label: r.name,
            style: i % 2 ? 'SECONDARY' : 'PRIMARY'
          })
        )
      })
    );

  @Slash('category-add', { description: 'Add reaction roles to a specific category.' })
  async execute(
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId) return log.error(`GuildID did not exist on interaction.`);
    const categories = await GET_GUILD_CATEGORIES(interaction.guildId);

    if (!categories.length) {
      log.debug(`Guild[${interaction.guildId}] has no categories to add react roles to.`);
      return interaction
        .reply(`Hey! There are no categories, go create one with \`/category-create\` and then try again.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const hasReactRoles = (await GET_REACT_ROLES_NOT_IN_CATEGORIES(interaction.guildId)).length;

    if (!hasReactRoles) {
      log.debug(`Guild[${interaction.guildId}] has no react roles to add to category.`);
      return interaction
        .reply(`Hey! Before trying to add react roles to a category, make sure you created some. Try out \`/react-role\` to create some!`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const selectMenu = new MessageActionRow({
      components: [new MessageSelectMenu({
        customId: 'select-category-add',
        placeholder: 'Pick a category',
        options: categories.map((c) => ({
          label: c.name,
          value: `category-add_${interaction.guildId}-${c.id}`,
        }))
      })]
    });

    await interaction
      .reply({
        ephemeral: true,
        content: `Hey! Select *one* category from below and then we'll move to adding react roles to it.`,
        components: [selectMenu],
      })
      .catch((e) => {
        log.error(`Interaction failed.`);
        log.error(`${e}`);
      });
  }
}
