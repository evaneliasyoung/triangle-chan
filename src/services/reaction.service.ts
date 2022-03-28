/**
 * @file      reaction.service.ts
 * @brief     Handles reactions.
 */

import {
  MessageReaction,
  PartialMessageReaction,
  User,
  PartialUser,
  GuildMember,
  Guild,
} from 'discord.js';
import {
  GET_REACT_MESSAGE_BY_MSGID_AND_EMOJI_ID,
  GET_CATEGORY_BY_ID,
  GET_REACT_ROLES_BY_CATEGORY_ID,
  GET_REACT_MESSAGE_BY_MESSAGE_ID,
} from '../database/database.js';
import {ReactMessage} from '../database/database.js';
import {logger, MessageWithErrorHandlerGenerator} from './log.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);

export default class ReactionHandler {
  handleReaction = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    type: 'add' | 'remove'
  ) => {
    if (!reaction || user.bot) return;

    const {message, emoji} = reaction;
    const {guild} = message;
    if (!guild) return;

    const hasReact = await GET_REACT_MESSAGE_BY_MESSAGE_ID(message.id).catch(
      MessageWithErrorHandler('Failed to query for react message.')
    );
    if (!hasReact) return log.debug('not a react message, ingore.');

    const emojiId = emoji.id ?? emoji.name;
    if (!emojiId)
      return log.debug(
        `Emoji doesn't exist on message[${message.id}] reaction for guild[${guild.id}].`
      );

    const reactMessage = await GET_REACT_MESSAGE_BY_MSGID_AND_EMOJI_ID(
      message.id,
      emojiId
    ).catch(MessageWithErrorHandler('Failed to query for react message.'));
    if (!reactMessage)
      return await reaction
        .remove()
        .catch(MessageWithErrorHandler('Failed to remove unused react emoji.'));
    if (!reactMessage.categoryId)
      return log.error(
        `React role[${reactMessage.id}] in guild[${guild.id}] does NOT have a category set.`
      );

    const member = await guild.members
      .fetch(user.id)
      .catch(
        MessageWithErrorHandler(`Fetching user[${user.id}] threw an error.`)
      );
    if (!member)
      return log.debug(
        `Failed to fetch member with user[${user.id}] for reaction[${type}] on guild[${guild.id}]`
      );

    const category = await GET_CATEGORY_BY_ID(reactMessage.categoryId);
    if (!category)
      return log.error(
        `Category[${reactMessage.categoryId}] does not exist for guild[${guild.id}]`
      );

    if (category.mutuallyExclusive)
      return this.mutuallyExclusive(
        reaction,
        reactMessage,
        member,
        guild,
        type
      );

    member.roles[type](reactMessage.roleId).catch(
      MessageWithErrorHandler(
        `Cannot ${type} role[${reactMessage.roleId}] to user[${member?.id}]`
      )
    );
  };

  mutuallyExclusive = async (
    reaction: MessageReaction | PartialMessageReaction,
    reactMessage: ReactMessage,
    member: GuildMember,
    guild: Guild,
    type: 'add' | 'remove'
  ) => {
    if (type === 'remove')
      return member.roles
        .remove(reactMessage.roleId)
        .catch(
          MessageWithErrorHandler(
            `Failed to remove role[${reactMessage.roleId}] from user[${member.id}] because they unreacted.`
          )
        );

    if (!reactMessage.categoryId)
      return log.error(`React role[${reactMessage.id}] category is undefined.`);

    const reactRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(
      reactMessage.categoryId
    );

    const categoryRoles = reactRoles.map(r => r.roleId);
    const updatedRoleList = member.roles.cache.filter(
      r => r.id === reactMessage.roleId || !categoryRoles.includes(r.id)
    );

    const role = await guild.roles
      .fetch(reactMessage.roleId)
      .catch(
        MessageWithErrorHandler(
          `Failed to fetch role[${reactMessage.roleId}] for guild[${guild.id}]`
        )
      );
    if (!role) return log.debug('Role not found.');

    await Promise.all(
      reaction.message.reactions.cache.map(
        other =>
          new Promise<void>((resolve, reject) => {
            if (other.emoji.id ?? other.emoji.name !== reactMessage.emojiId) {
              other.users
                .fetch()
                .then(members => {
                  if (members!.has(member.id))
                    other.users
                      .remove(member)
                      .then(() => resolve())
                      .catch(reject);
                })
                .catch(reject);
            }
          })
      )
    );
    updatedRoleList.set(role.id, role);
    await member
      .edit({roles: updatedRoleList})
      .catch(MessageWithErrorHandler('Failed to update members roles.'));
  };
}
