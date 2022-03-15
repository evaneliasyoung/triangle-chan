/**
 * @file      reactions.ts
 * @brief     Reaction helper functions.
 */

import {Client, Message} from 'discord.js';
import {Logger} from 'winston';
import {
  CREATE_REACT_MESSAGE,
  GET_REACT_MESSAGE_BY_CATEGORY_ID,
  GET_CATEGORY_BY_ID,
  DELETE_REACT_MESSAGE_BY_ID,
  GET_REACT_ROLES_BY_CATEGORY_ID,
} from '../../database/database.js';
import {ReactRole} from '../../database/entities/react-role.entity.js';
import EmbedService from '../../services/embed.service.js';
import {
  logger,
  MessageWithErrorHandlerGenerator,
} from '../../services/log.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);

export const reactToMessage = (
  message: Message,
  guildId: string,
  categoryRoles: ReactRole[],
  channelId: string,
  categoryId: number,
  isCustomMessage: boolean,
  log: Logger
) => {
  return Promise.all(
    categoryRoles.map(r => {
      message
        .react(r?.emojiTag ? `nn:${r.emojiId}` : r.emojiId)
        .then(() => {
          const {emojiId, roleId} = r;
          CREATE_REACT_MESSAGE({
            emojiId,
            roleId,
            guildId,
            categoryId,
            isCustomMessage,
            channelId,
            messageId: message.id,
          });
        })
        .catch(
          MessageWithErrorHandler(
            `Failed to react to message[${message.id}] with emoji[${
              r.emojiTag ?? r.emojiId
            }] in guild[${guildId}]`
          )
        );
    })
  );
};

export enum ReactMessageUpdate {
  categoryEdit,
  reactRoleRemove,
}

export const updateReactMessages = async (
  client: Client,
  categoryId: number,
  log: Logger,
  type: ReactMessageUpdate,
  embedService: EmbedService
) => {
  try {
    const reactMessage = await GET_REACT_MESSAGE_BY_CATEGORY_ID(categoryId);
    if (!reactMessage)
      return log.debug(`No react messages exist with category[${categoryId}]`);

    const channel = await client.channels.fetch(reactMessage.channelId);
    if (!channel?.isText())
      return log.debug(
        `Guild[${reactMessage.guildId}] apparently does not have channel[${reactMessage.channelId}]`
      );

    const message = await channel.messages.fetch(reactMessage.messageId);
    if (!message)
      return log.debug(
        `Could not find message[${reactMessage.messageId}] in channel[${reactMessage.channelId}] in guild[${reactMessage.guildId}]`
      );

    const categoryRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(categoryId);
    if (!reactMessage.categoryId)
      return log.error(`ReactMessage has no category somehow`);
    const category = await GET_CATEGORY_BY_ID(reactMessage.categoryId);
    if (!category)
      return log.error(
        `Category[${reactMessage.categoryId}] does not exist in guild[${reactMessage.guildId}]`
      );

    const embed = embedService.reactRoleEmbed(categoryRoles, category);
    if (!reactMessage.isCustomMessage)
      await message.edit({embeds: [embed]}).catch(() => {
        log.error(
          `Failed to edit message[${reactMessage.messageId}] with updated react role embed in guild[${reactMessage.guildId}]`
        );
      });

    if (type === ReactMessageUpdate.reactRoleRemove) {
      await DELETE_REACT_MESSAGE_BY_ID(reactMessage.messageId);
      await message.reactions.removeAll();
      reactToMessage(
        message,
        reactMessage.guildId,
        categoryRoles,
        channel.id,
        reactMessage.categoryId,
        reactMessage.isCustomMessage,
        log
      );
    }
  } catch (e) {
    log.error(`Caught an error updating reaction messages.`);
    log.error(`${e}`);
  }
};
