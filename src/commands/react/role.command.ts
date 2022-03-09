/**
 * @file      role.command.ts
 * @brief     Create a new react role. Give the command a role and an emoji.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction, GuildMember, Interaction, MessageActionRow, MessageButton, MessageEmbed, Role, User } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import emojiRegex from 'emoji-regex';
import { CREATE_REACT_ROLE, GET_REACT_ROLES_BY_GUILD, GET_REACT_ROLE_BY_EMOJI, GET_REACT_ROLE_BY_ROLE_ID } from '../../database/database.js';
import { EReactRoleType } from '../../database/entities/react-role.entity.js';
import { CLIENT_ID } from '../../env.js';
import { InteractionFailedHandlerGenerator, logger, MessageWithErrorHandlerGenerator } from '../../services/log.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class ReactRoleCommand {
  @Slash('react-role', { description: 'Create a new react role. Give the command a role and an emoji.' })
  async execute(
    @SlashOption('role', { description: 'The role you want to use.', type: 'ROLE' })
    role: Role,
    @SlashOption('emoji', { description: 'The emoji you want to use.', type: 'STRING' })
    emoji: string,
    interaction: CommandInteraction
  ) {
    if (!interaction.isCommand() || !interaction.guildId) return;

    const { guild } = interaction;
    if (!guild) return;

    if (!role || !emoji) {
      return await interaction
        .reply({ ephemeral: true, content: 'I had some issues finding that role or emoji. Please try again.', })
        .catch(InteractionFailedHandler);
    }

    const reactRolesNotInCategory = (await GET_REACT_ROLES_BY_GUILD(guild.id)).filter(r => !r.categoryId).length;

    if (reactRolesNotInCategory >= 24) return await interaction.reply(`Hey! It turns out you have ${reactRolesNotInCategory} react roles not in a category.\nPlease add some react roles to a category before creating anymore. If however \`/category-add\` isn't responded please *remove* some react roles to get below 25 **not ina  category**. This is due to a Discord limitation!`);

    const isValidPosition = isValidRolePosition(interaction, role);

    if (!isValidPosition) {
      const embed = new MessageEmbed({
        title: 'Reaction Roles Setup',
        description: `The role <@&${role.id}> is above me in the role list so I can't hand it out.\nPlease make sure I have a role that is above it.`
      });

      const button = new MessageActionRow({
        components: [new MessageButton({
          label: 'Discord Roles',
          url: 'https://support.discord.com/hc/en-us/articles/214836687-Role-Management-101',
          style: 'LINK'
        })]
      });

      return await interaction
        .reply({
          ephemeral: true,
          embeds: [embed],
          components: [button],
        })
        .catch(InteractionFailedHandler);
    }

    const customEmoji = /(a?):\w+:(\d{10,20})/g.exec(emoji);

    let emojiId = emoji;
    let isEmojiAnimated = false;

    if (customEmoji) {
      isEmojiAnimated = customEmoji[1] === 'a';
      emojiId = customEmoji[2];
    } else {
      const unicodeEmoji = emoji.match(emojiRegex());

      if (!unicodeEmoji) {
        return await interaction
          .reply({
            ephemeral: true,
            content: `Hey! You didn't pass in a proper emoji. You need to either pass in a Discord emoji or a servers custom emoji.`,
          })
          .catch(MessageWithErrorHandler(`Failed to alert user of invalid emojis.`));
      }

      emojiId = unicodeEmoji[0];
    }

    if (!emojiId || emojiId === '') {
      log.error(`Failed to extract emoji[${emoji}] with regex from string.`);

      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I had an issue trying to use that emoji. Please wait a moment and try again.`,
        })
        .catch(InteractionFailedHandler);
    }

    let reactRole = await GET_REACT_ROLE_BY_EMOJI(emojiId, guild.id);

    if (reactRole) {
      const emojiMention = reactRole?.emojiTag ?? reactRole?.emojiId;

      return await interaction
        .reply({
          ephemeral: true,
          content: `The react role (${emojiMention} - <@&${reactRole.roleId}>) already has this emoji assigned to it.`,
        })
        .catch(InteractionFailedHandler);
    }

    reactRole = await GET_REACT_ROLE_BY_ROLE_ID(role.id);

    if (reactRole) {
      const emojiMention = reactRole?.emojiTag ?? reactRole?.emojiId;
      return await interaction
        .reply({
          ephemeral: true,
          content: `There's a react role already using the role \`${reactRole.name}\` (${emojiMention} - <@&${reactRole.roleId}>).`,
        })
        .catch(InteractionFailedHandler);
    }

    /* This is used when mentioning a custom emoji, otherwise it's unicode and doesn't have a custom ID. */
    const emojiTag = customEmoji
      ? `<${isEmojiAnimated ? 'a' : ''}:n:${emojiId}>`
      : undefined;

    CREATE_REACT_ROLE(
      role.name,
      role.id,
      emojiId,
      emojiTag,
      interaction.guildId,
      EReactRoleType.normal
    )
      .then(async reactRole => {
        log.debug(`Successfully created the react role[${role.id}] with emoji[${emojiId}]`);

        const emojiMention = reactRole?.emojiTag ?? reactRole?.emojiId;

        await interaction
          .reply({
            ephemeral: true,
            content: `:tada: Successfully created the react role (${emojiMention} - <@&${role.id}>) :tada:`,
          })
          .catch(InteractionFailedHandler);
      })
      .catch(async e => {
        log.error(`Failed to create react role[${role.id}] | guild[${interaction.guildId}] | emoji[id: ${emojiId} : string: ${emoji}]`);
        log.error(e);

        await interaction
          .reply({
            ephemeral: true,
            content: 'React role failed to create. Please try again.',
          })
          .catch(InteractionFailedHandler);
      });
  }
}

async function isValidRolePosition(interaction: Interaction, role: Role) {
  const clientUser = await interaction.guild?.members.fetch(CLIENT_ID);
  if (!clientUser) return false;
  log.debug('isValidRolePosition', { interaction, role, clientUser, roles: clientUser.roles, cache: clientUser.roles.cache });

  return clientUser.roles.cache.some(r => r.position > role.position);
}
