/**
 * @file      react-role.entity.ts
 * @brief     React role database entity.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
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

  @Column()
  name!: string;

  @Column()
  roleId!: string;

  @Column()
  emojiId!: string;

  @Column({ nullable: true })
  emojiTag?: string;

  @Column()
  guildId!: string;

  @Column()
  type!: EReactRoleType;

  @Column('int', { nullable: true })
  categoryId?: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;
}
