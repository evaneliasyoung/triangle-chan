/**
 * @file      message.command.ts
 * @brief     Use this command to react with a specific category of roles to a message.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction, MessageActionRow, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { GET_CATEGORY_BY_ID, GET_GUILD_CATEGORIES, GET_REACT_ROLES_BY_CATEGORY_ID } from '../../database/database.js';
import { InteractionFailedHandlerGenerator, logger, MessageWithErrorHandlerGenerator } from '../../services/log.service.js';
import { reactToMessage } from '../../utils/discordx/reactions.js';
import { isTextChannel } from '../../utils/type-assertion.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class ReactMessageCommand {
  handleSelect = async (interaction: SelectMenuInteraction, args: string[]) => {
    const [guildId, channelId, messageId, categoryId] = args;

    const channel = await interaction.client.channels.fetch(channelId);

    if (!channel || !isTextChannel(channel)) {
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I had an issue handling the option you selected for \`/react-channel\`. Please wait a moment and try again.`,
        })
        .catch(InteractionFailedHandler);
    }

    const message = await channel.messages.fetch(messageId);

    if (!message) {
      log.debug(`User gave message[${messageId}] that doesn't exist in channel[${channelId}] in guild[${guildId}]`);
      return await interaction.reply(`Hey! I had an issue finding that message. Give me a sec and try again.`);
    }

    const category = await GET_CATEGORY_BY_ID(Number(categoryId));

    if (!category) {
      log.error(`Category[${categoryId}] is missing for guild[${guildId}] despite having passed previous check.`);
      return await interaction.reply(
        `Hey! I had an issue finding that category. Please wait a second and try again.`
      );
    }

    const reactRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(Number(categoryId));

    if (!reactRoles.length) {
      log.error(`Category[${categoryId}] in guild[${guildId}] somehow has no react roles associated with it.`);

      return await interaction.reply(`Hey! I had issues getting the react roles for the category. Can you wait a sec and try again?`);
    }

    interaction
      .reply({
        ephemeral: true,
        content: `I'm reacting to the message with all react roles associated with ${category.name}. Please give me a moment to react fully before obtaining roles.`,
      })
      .catch(MessageWithErrorHandler(`Failed to tell user we're reacting.`));

    reactToMessage(
      message,
      interaction.guildId || guildId,
      reactRoles,
      channel.id,
      category.id,
      true,
      log
    );
  };

  @Slash('react-message', { description: 'Use this command to react with a specific category of roles to a message.' })
  async execute(
    @SlashOption('message-link', { description: 'Copy a message link and place it here for the message you want me to react to.' })
    messageLink: string,
    interaction: CommandInteraction
  ) {
    if (!interaction.isCommand() || !interaction.guildId) return;

    if (!messageLink)
      return await interaction
        .reply(`Hmm, I'm not sure what happened but I can't see the message link. Please try again.`)
        .catch(InteractionFailedHandler);


    const [_, channelId, messageId] = messageLink.match(/\d+/g) ?? [];

    if (!channelId || !messageId)
      return await interaction
        .reply(`Hey! That doesn't look like a valid message link. Make sure to right click and copy \`Copy Message Link \``)
        .catch(MessageWithErrorHandler('Failed to alert user about invalid message link'));


    const channel = await interaction.guild?.channels
      .fetch(channelId)
      .catch(MessageWithErrorHandler(`Failed to fetch channel[${channelId}] in guild[${interaction.guildId}]`));
    if (!channel || !isTextChannel(channel))
      return await interaction
        .reply(`Hey! I couldn't find that channel, make sure you're copying the message link right.`)
        .catch(InteractionFailedHandler);


    const message = await channel.messages.fetch(messageId)
      .catch(MessageWithErrorHandler(`Failed to fetch message[${messageId}] for channel[${channel.id}]`));
    if (!message)
      return await interaction
        .reply(`Hey! I couldn't find that message, make sure you're copying the message link right.`)
        .catch(InteractionFailedHandler);


    const guildHasNoCategories = `It appears there are no categories! Try out \`/category-create\` to create a category reaction pack to store and manage your roles much easier.`;
    const allCategoriesAreEmpty = `Hey! It appears all your categories are empty. I can't react to the message you want if you have at least one react role in at least one category. Check out \`/category-add\` to start adding roles to a category.`;

    const categories = await GET_GUILD_CATEGORIES(interaction.guildId)
      .catch(MessageWithErrorHandler(`Failed to get categories for guild[${interaction.guildId}]`));
    if (!categories) return await interaction.reply(`Hey! I'm encountering an issue trying to access the servers categories. Please be patient.`);

    const guildHasCategories = categories.length;
    const categoryRoles = await Promise.all(categories.map(c => GET_REACT_ROLES_BY_CATEGORY_ID(c.id)));
    const allEmptyCategories = categoryRoles.filter(r => r.length).length;

    if (!guildHasCategories) {
      log.debug(`Guild[${interaction.guildId}] has no categories. Cannot do command[react-channel]`);
      return await interaction
        .reply({ content: guildHasNoCategories })
        .catch(InteractionFailedHandler);
    } else if (!allEmptyCategories) {
      log.debug(`Guild[${interaction.guildId}] has categories but all of them are empty.`);
      return await interaction
        .reply({ content: allCategoriesAreEmpty })
        .catch(InteractionFailedHandler);
    }

    const selectMenu = new MessageActionRow({
      components: [new MessageSelectMenu({
        custom_id: `select-message`,
        placeholder: 'Pick a category to react with.',
        options: categories.map((c, idx) => ({
          label: c.name ?? `Category-${idx}`,
          description: c.description?.slice(0, 99) ?? '',
          value: `react-channel_${c.guildId}-${channelId}-${messageId}-${c.id}`,
        }))
      })]
    });

    await interaction
      .reply({
        content: `Let's make this easier for you. Select a category and I will use the reaction roles in that category to react to the message.`,
        components: [selectMenu],
      })
      .catch(InteractionFailedHandler);
  };
}
