/**
 * @file      react-role.entity.ts
 * @brief     React role database entity.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity.js';

export enum EReactRoleType {
  normal = 1,
  addOnly,
  removeOnly,
}

export interface IReactRole {
  name: string;
  roleId: string;
  emojiId: string;
  emojiTag?: string;
  guildId: string;
  type: EReactRoleType;
  categoryId?: number;
  category?: Category;
}

@Entity()
export class ReactRole extends BaseEntity implements IReactRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  roleId!: string;

  @Column('varchar')
  emojiId!: string;

  @Column('varchar', { nullable: true })
  emojiTag?: string;

  @Column('varchar')
  guildId!: string;

  @Column('int')
  type!: EReactRoleType;

  @Column('unsigned big int', { nullable: true })
  categoryId?: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;
}

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

export const GET_REACT_ROLES_BY_GUILD_ID = async (guildId: string) =>
  await ReactRole.find({ where: { guildId } });

export const GET_REACT_ROLES_NOT_IN_CATEGORIES = async (guildId: string) =>
  await ReactRole.find({ where: { guildId, categoryId: null } });

export const GET_REACT_ROLE_BY_ID = async (id: number) =>
  await ReactRole.findOne({ where: { id } });

export const GET_REACT_ROLE_BY_ROLE_ID = async (roleId: string) =>
  await ReactRole.findOne({ where: { roleId } });

export const GET_REACT_ROLES_BY_CATEGORY_ID = async (id: number) =>
  await ReactRole.find({ where: { category: { id } } });

export const GET_REACT_ROLE_BY_EMOJI = async (emojiId: string, guildId: string) =>
  await ReactRole.findOne({ where: { emojiId, guildId } });

export const UPDATE_REACT_ROLE_EMOJI_TAG = async (roleId: string, emojiTag: string) => {
  const reactRole = await ReactRole.findOne({ where: { roleId } });
  if (!reactRole) throw Error(`Role[${roleId}] doesn't exist despite having just found it.`);

  reactRole.emojiTag = emojiTag;
  return await reactRole.save();
};

export const UPDATE_REACT_ROLE_CATEGORY = async (id: number, categoryId: number) => {
  const reactRole = await ReactRole.findOne({ where: { id } });
  if (!reactRole) return;

  const category = await Category.findOne({ where: { id: categoryId } });
  if (!category) throw Error(`Category[${categoryId}] does not exist.`);

  reactRole.category = category;
  return reactRole.save();
};

export const FREE_ROLES_BY_CATEGORY_ID = async (id: number) =>
  await Promise
    .all((await GET_REACT_ROLES_BY_CATEGORY_ID(id))
      .map(role =>
        ReactRole.update(role.id, { categoryId: undefined })
      ));
