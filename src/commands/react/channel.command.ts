/**
 * @file      channel.command.ts
 * @brief     Send all categories with react roles to the selected channel.
 */
/* eslint @typescript-eslint/no-explicit-any: [0] */

import {
  AnyChannel,
  CommandInteraction,
  Guild,
  GuildMember,
  Permissions,
} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  GET_GUILD_CATEGORIES,
  GET_REACT_ROLES_BY_CATEGORY_ID,
} from '../../database/database.js';
import EmbedService from '../../services/embed.service.js';
import {reactToMessage} from '../../utils/discordx/reactions.js';
import {isTextChannel} from '../../utils/type-assertion.js';
import {PermissionMappings} from '../permissions.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
  MessageWithErrorHandlerGenerator,
} from '../../services/log.service.js';
import {timeout} from '../../utils/native/timeout.js';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class ReactChannelCommand {
  #embedService = new EmbedService();
  #permissionService = new PermissionService();

  @Slash('react-channel', {
    description:
      'Send all categories with react roles to the selected channel.',
  })
  async execute(
    @SlashOption('channel', {
      description: 'The channel what will receive reaction roles.',
      type: 'CHANNEL',
    })
    channel: Extract<AnyChannel, {guild: Guild}>,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/react-channel` can only be used in a server.',
      });

    if (
      !this.#permissionService.canManageRoles(
        interaction.member as GuildMember | null
      )
    )
      return await interaction
        .reply({
          ephemeral: true,
          content: "Hey! You don't have permission to use `/react-channel`.",
        })
        .catch(InteractionFailedHandler);

    try {
      await interaction
        .deferReply({ephemeral: true})
        .catch(
          MessageWithErrorHandler(
            "Failed to defer interaction and the try/catch didn't catch it"
          )
        );
    } catch (e) {
      log.error('Failed to defer interaction');
      log.error(`${e}`);
      return;
    }

    const categories = await GET_GUILD_CATEGORIES(interaction.guildId).catch(
      MessageWithErrorHandler(
        `Failed to get categories for guild[${interaction.guildId}]`
      )
    );

    if (!categories) {
      log.debug(`Guild[${interaction.guildId}] has no categories.`);

      return await interaction
        .editReply(
          'Hey! You need to make some categories and fill them with react roles before running this command. Check out `/category-add`.'
        )
        .catch(InteractionFailedHandler);
    }

    const allCategoriesAreEmpty =
      "Hey! It appears all your categories are empty. I can't react to the message you want if you have at least one react role in at least one category. Check out `/category-add` to start adding roles to a category.";
    const categoryRoles = await Promise.all(
      categories.map(c => GET_REACT_ROLES_BY_CATEGORY_ID(c.id))
    );

    const allEmptyCategories = categoryRoles.filter(r => r.length).length;

    if (!allEmptyCategories) {
      log.debug(
        `Guild[${interaction.guildId}] has categories but all of them are empty.`
      );

      return await interaction
        .editReply({content: allCategoriesAreEmpty})
        .catch(InteractionFailedHandler);
    }

    if (!channel) {
      log.error(
        `Could not find channel on interaction for guild[${interaction.guildId}]`
      );

      return await interaction
        .editReply(
          'Hey! I failed to find the channel from the command. Please wait a second and try again.'
        )
        .catch(InteractionFailedHandler);
    } else if (!isTextChannel(channel)) {
      log.error(
        `Passed in channel[${channel.id}] was not a text channel for guild[${interaction.guildId}]`
      );

      return await interaction
        .editReply('Hey! I only support sending embeds to text channels!')
        .catch(InteractionFailedHandler);
    }

    const permissions = [
      Permissions.FLAGS.READ_MESSAGE_HISTORY,
      Permissions.FLAGS.ADD_REACTIONS,
      Permissions.FLAGS.SEND_MESSAGES,
      Permissions.FLAGS.MANAGE_MESSAGES,
      Permissions.FLAGS.MANAGE_ROLES,
    ]
      .map(p => `\`${PermissionMappings.get(p)}\``)
      .join(' ');

    const permissionError =
      `Hey! I don't have the right permissions in <#${channel.id}> to correctly setup the react role embeds. I need ${permissions} to work as intended.` +
      `
Why do I need these permissions in this channel?
\`\`\`
- To be able to react I have to be able to see the message so I need the history for the channel.
- Have to be able to react, it is a react role bot.
- Have to be able to send embeds.
- To update the embeds react role list.
- To update users roles.
\`\`\``;

    await timeout(3000);

    for (const category of categories) {
      const categoryRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(category.id);
      if (!categoryRoles.length) continue;

      const embed = this.#embedService.reactRoleEmbed(categoryRoles, category);

      try {
        const reactEmbedMessage = await channel.send({embeds: [embed]});

        await reactToMessage(
          reactEmbedMessage,
          interaction.guildId,
          categoryRoles,
          channel.id,
          category.id,
          false,
          log
        );
      } catch (e: any) {
        log.error('Failed to send embeds');
        log.error(`${e}`);

        if (e?.httpStatus === 403)
          return await interaction.editReply(permissionError);

        return await interaction.editReply(
          `Hey! I encounted an error. Report this to the support server. \`${e}\``
        );
      }

      await timeout(1000);
    }

    await interaction
      .editReply({
        content: 'Hey! I sent those embeds and am currently reacting to them.',
      })
      .catch(MessageWithErrorHandler('Failed to edit interaction reply.'));
  }
}
