/**
 * @file      react-message.entity.ts
 * @brief     React message database entity.
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

export interface IReactMessage {
  guildId: string;
  messageId: string;
  channelId: string;
  roleId: string;
  emojiId: string;
  isCustomMessage: boolean;
  categoryId: number;
}

@Entity()
export class ReactMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  isCustomMessage!: boolean;

  @Column()
  messageId!: string;

  @Column()
  channelId!: string;

  @Column()
  emojiId!: string;

  @Column()
  categoryId!: number;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column()
  roleId!: string;

  @Column()
  guildId!: string;
}
