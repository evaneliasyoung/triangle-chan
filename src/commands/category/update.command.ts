/**
 * @file      update.command.ts
 * @brief     Have an existing react role embed you want updated? Use this command!.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { GET_REACT_MESSAGE_BY_MESSAGE_ID, GET_CATEGORY_BY_ID, GET_REACT_ROLES_BY_CATEGORY_ID, DELETE_REACT_MESSAGES_BY_MESSAGE_ID } from '../../database/database.js';
import { EmbedService } from '../../services/embed.service.js';
import { isTextChannel } from '../../utils/type-assertion.js';
import { reactToMessage } from '../../utils/reactions.js';
import { logger } from '../../services/log.service.js';
const log = logger(import.meta);

@Discord()
export abstract class CategoryUpdateCommand {
  @Slash('category-update', { description: 'Have an existing react role embed you want updated? Use this command!' })
  async execute(
    @SlashOption('message-link', { description: 'The link to the category embed messge. This will be used to find and update the embed.' })
    messageLink: string,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId) return log.error(`GuildID did not exist on interaction.`);

    if (!messageLink) {
      log.error(`Undefined message-link despite being required in guild[${interaction.guildId}].`);

      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! Something happened and I can't see the passed in emssage link. Could you try again?`,
        })
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const [_, channelId, messageId] = messageLink.match(/\d+/g) ?? [];
    const channel = await interaction.guild?.channels.fetch(channelId);

    if (!channel || !isTextChannel(channel)) {
      return await interaction
        .reply(`Hey! I couldn't find that channel, make sure you're copying the message link right.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const message = await channel.messages.fetch(messageId);

    if (!message) {
      return await interaction
        .reply(`Hey! I couldn't find that message, make sure you're copying the message link right.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const reactMessage = await GET_REACT_MESSAGE_BY_MESSAGE_ID(messageId);

    if (!reactMessage) {
      log.debug(`No react messages exist with messageId[${messageId}] in guild[${interaction.guildId}]`);

      return interaction.reply({
        ephemeral: true,
        content: `Hey! I looked and didn't see any react roles saved that are associated with that message.`,
      });
    }

    if (!reactMessage.categoryId) return log.error(`ReactMessage has no category somehow`);
    const category = await GET_CATEGORY_BY_ID(reactMessage.categoryId);

    if (!category) {
      log.debug(`Category not found with categoryId[${reactMessage.categoryId}]] in guild[${interaction.guildId}]`);

      return interaction
        .reply(`Hey! I couldn't find a category with that name. The name is _case sensitive_ so make sure it's typed correctly.`)
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const categoryRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(category.id);

    if (!categoryRoles || !categoryRoles.length) {
      log.debug(`Category[${category.id}] in guild[${category.guildId}] has no react roles associated with it.`);

      return interaction.reply({
        ephemeral: true,
        content: `Hey! I see that message uses category \`${category.name}\` but it has no react roles in it.`,
      });
    }

    try {
      const embed = EmbedService.reactRoleEmbed(categoryRoles, category);

      await DELETE_REACT_MESSAGES_BY_MESSAGE_ID(reactMessage.messageId);
      await message.reactions.removeAll();
      await message
        .edit({ embeds: [embed] })
        .then(() => {
          log.debug(`Updated category[${category.id}] embed.`);

          interaction.reply({
            ephemeral: true,
            content: `Hey! I updated the react role embed message related to this category.`,
          });
        })
        .catch((e) => {
          log.error(`Failed to update message for category[${category.id}]`);
          log.error(`${e}`);

          interaction.reply({
            ephemeral: true,
            content: `Hey! I wasn't able to update the message for some reason. Most likely a message history / manage permission issue.`,
          });
        });

      reactToMessage(
        message,
        interaction.guildId,
        categoryRoles,
        channel.id,
        reactMessage.categoryId,
        reactMessage.isCustomMessage,
        log
      );
    } catch (e) {
      log.error(`Failed to edit category[${category.id}] embed and re-react to it for guild[${interaction.guildId}]`);
      log.error(`${e}`);
    }
  };
}
