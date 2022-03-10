/**
 * @file      react-message.entity.ts
 * @brief     React message database entity.
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

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column('varchar')
  roleId!: string;

  @Column('varchar')
  guildId!: string;
}
