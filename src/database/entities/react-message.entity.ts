/**
 * @file      react-message.entity.ts
 * @brief     React message database entity.
 */

import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Category} from './category.entity.js';

export interface IReactMessage {
  isCustomMessage: boolean;
  messageId: string;
  channelId: string;
  emojiId: string;
  categoryId: number;
  category?: Category;
  roleId: string;
  guildId: string;
}

export interface IReactMessageOptions {
  isCustomMessage: boolean;
  messageId: string;
  channelId: string;
  emojiId: string;
  categoryId: number;
  roleId: string;
  guildId: string;
}

@Entity()
export class ReactMessage extends BaseEntity implements IReactMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'bool'})
  isCustomMessage!: boolean;

  @Column({type: 'varchar', width: 256})
  messageId!: string;

  @Column({type: 'varchar', width: 256})
  channelId!: string;

  @Column({type: 'varchar', width: 256})
  emojiId!: string;

  @Column({type: 'bigint'})
  categoryId!: number;

  @ManyToOne(() => Category, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'categoryId'})
  category?: Category;

  @Column('varchar')
  roleId!: string;

  @Column('varchar')
  guildId!: string;
}

export const GET_REACT_MESSAGE_BY_CATEGORY_ID = async (categoryId: number) =>
  await ReactMessage.findOne({where: {category: {id: categoryId}}});

export const GET_REACT_MESSAGE_BY_ROLE_ID = async (roleId: string) =>
  await ReactMessage.findOne({where: {roleId}});

export const GET_REACT_MESSAGE_BY_MESSAGE_ID = async (messageId: string) =>
  await ReactMessage.findOne({where: {messageId}});

export const GET_REACT_MESSAGE_BY_MSGID_AND_EMOJI_ID = async (
  messageId: string,
  emojiId: string
) => await ReactMessage.findOne({where: {messageId, emojiId}});

export const DELETE_REACT_MESSAGE_BY_ROLE_ID = async (roleId: string) =>
  await ReactMessage.delete({roleId});

export const DELETE_REACT_MESSAGE_BY_ID = async (messageId: string) =>
  await ReactMessage.delete({messageId});

export const CREATE_REACT_MESSAGE = async (
  reactMessageOptions: IReactMessageOptions
) => {
  const reactMessage = new ReactMessage();
  const {
    channelId,
    messageId,
    emojiId,
    guildId,
    roleId,
    isCustomMessage,
    categoryId,
  } = reactMessageOptions;
  Object.assign(reactMessage, {
    channelId,
    messageId,
    emojiId,
    guildId,
    roleId,
    isCustomMessage,
  });

  const category = await Category.findOne({where: {id: categoryId}});
  if (!category)
    throw Error(
      `Category[${categoryId}] not found when creating react message.`
    );

  reactMessage.category = category;
  return reactMessage.save();
};
