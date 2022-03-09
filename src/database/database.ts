/**
 * @file      database.ts
 * @brief     Database controller.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-08
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { Category, ReactMessage, ReactRole } from './entities/index.js';
import { ICategory } from './entities/category.entity.js';
import { IReactMessageOptions } from './entities/react-message.entity.js';
import { EReactRoleType } from './entities/react-role.entity.js';

export const CREATE_REACT_ROLE = async (
  name: string,
  roleId: string,
  emojiId: string,
  emojiTag: string | undefined,
  guildId: string,
  type: EReactRoleType
) =>
  await ReactRole.create({ emojiId, emojiTag, roleId, guildId, name, type }).save();

export const DELETE_REACT_ROLE_BY_ROLE_ID = async (roleId: string) =>
  await ReactRole.delete({ roleId });


export const DELETE_ALL_REACT_ROLES_BY_GUILD_ID = async (guildId: string) =>
  await ReactRole.delete({ guildId });


export const GET_REACT_ROLES_BY_GUILD = async (guildId: string) =>
  await ReactRole.find({ where: { guildId } });


export const GET_REACT_ROLES_NOT_IN_CATEGORIES = async (guildId: string) =>
  await ReactRole.find({ where: { guildId, categoryId: null } });


export const GET_REACT_ROLE_BY_ID = async (id: number) =>
  await ReactRole.findOne({ where: { id } });


export const GET_REACT_ROLE_BY_ROLE_ID = async (roleId: string) =>
  await ReactRole.findOne({ where: { roleId } });


export const GET_REACT_ROLES_BY_CATEGORY_ID = async (categoryId: number) =>
  await ReactRole.find({ where: { category: { id: categoryId } } });


export const UPDATE_REACT_ROLE_EMOJI_TAG = async (roleId: string, emojiTag: string) => {
  const reactRole = await ReactRole.findOne({ where: { roleId } });
  if (!reactRole) throw Error(`Role[${roleId}] doesn't exist despite having just found it.`);

  reactRole.emojiTag = emojiTag;
  return await reactRole.save();
};

export const GET_REACT_ROLE_BY_EMOJI = async (emojiId: string, guildId: string) =>
  await ReactRole.findOne({ where: { emojiId, guildId } });

export const UPDATE_REACT_ROLE_CATEGORY = async (id: number, categoryId: number) => {
  const reactRole = await ReactRole.findOne({ where: { id } });
  if (!reactRole) return;

  const category = await Category.findOne({ where: { id: categoryId } });
  if (!category) throw Error(`Category[${categoryId}] does not exist.`);

  reactRole.category = category;
  return reactRole.save();
};

export const CREATE_REACT_MESSAGE = async (reactMessageOptions: IReactMessageOptions) => {
  const reactMessage = new ReactMessage();
  const { channelId, messageId, emojiId, guildId, roleId, isCustomMessage, categoryId } = reactMessageOptions;
  Object.assign(reactMessage, { channelId, messageId, emojiId, guildId, roleId, isCustomMessage });

  const category = await Category.findOne({ where: { id: categoryId } });
  if (!category) throw Error(`Category[${categoryId}] not found when creating react message.`);

  reactMessage.category = category;
  return reactMessage.save();
};

export const GET_REACT_MESSAGE_BY_CATEGORY_ID = async (categoryId: number) =>
  await ReactMessage.find({ where: { category: { id: categoryId } } });

export const GET_REACT_MESSAGE_BY_ROLE_ID = async (roleId: string) =>
  await ReactMessage.findOne({ where: { roleId } });

export const GET_REACT_MESSAGE_BY_MESSAGE_ID = async (messageId: string) =>
  (await ReactMessage.find({ where: { messageId } }))[0];

export const GET_REACT_MESSAGE_BY_MSGID_AND_EMOJI_ID = async (messageId: string, emojiId: string) =>
  await ReactMessage.findOne({ where: { messageId, emojiId } });

export const DELETE_REACT_MESSAGE_BY_ROLE_ID = async (roleId: string) =>
  await ReactMessage.delete({ roleId });

export const DELETE_REACT_MESSAGES_BY_MESSAGE_ID = async (messageId: string) =>
  await ReactMessage.delete({ messageId });

export const GET_GUILD_CATEGORIES = async (guildId: string) =>
  await Category.find({ where: { guildId } });

export const GET_ROLES_BY_CATEGORY_ID = async (categoryId: number) =>
  await ReactRole.find({ where: { category: { id: categoryId } } });

export const CREATE_GUILD_CATEGORY = async (guildId: string, name: string, description?: string | null, mutuallyExclusive?: boolean | null) =>
  await Category.create({
    guildId,
    name,
    description: description ?? '',
    mutuallyExclusive: mutuallyExclusive ?? false
  }).save();

export const EDIT_CATEGORY_BY_ID = (id: number, category: Partial<ICategory>) =>
  Category.update({ id }, category);

export const GET_CATEGORY_BY_NAME = async (guildId: string, name: string) =>
  await Category.findOne({ where: { guildId, name } });

export const GET_CATEGORY_BY_ID = (id: number) =>
  Category.findOne({ where: { id } });

export const DELETE_CATEGORY_BY_ID = (id: number) =>
  Category.delete({ id });
