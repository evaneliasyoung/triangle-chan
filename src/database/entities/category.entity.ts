/**
 * @file      category.entity.ts
 * @brief     Role category database entity.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ICategory {
  guildId: string;
  name: string;
  description: string;
  mutuallyExclusive: boolean;
}

@Entity()
export class Category extends BaseEntity implements ICategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', width: 256 })
  guildId!: string;

  @Column({ type: 'varchar', width: 90 })
  name!: string;

  @Column({ type: 'varchar', width: 4096 })
  description!: string;

  @Column({ type: 'bool' })
  mutuallyExclusive!: boolean;
}

export const GET_GUILD_CATEGORIES = async (guildId: string) =>
  await Category.find({ where: { guildId } });

export const CREATE_GUILD_CATEGORY = async (guildId: string, name: string, description?: string | null, mutuallyExclusive?: boolean | null) =>
  await Category.create({
    guildId,
    name,
    description: description ?? '',
    mutuallyExclusive: mutuallyExclusive ?? false
  }).save();

export const EDIT_CATEGORY_BY_ID = async (id: number, category: Partial<ICategory>) =>
  await Category.update({ id }, category);

export const GET_CATEGORY_BY_NAME = async (guildId: string, name: string) =>
  await Category.findOne({ where: { guildId, name } });

export const GET_CATEGORY_BY_ID = async (id: number) =>
  await Category.findOne({ where: { id } });

export const DELETE_CATEGORY_BY_ID = async (id: number) =>
  await Category.delete({ id });
