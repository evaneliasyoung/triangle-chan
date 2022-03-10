/**
 * @file      counter.entity.ts
 * @brief     Counter channel database entity.
 *
 * @author    Evan Elias Young
 * @date      2022-03-10
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ECounterType {
  total = 1,
  online,
  donor,
  role
}

export interface ICounter {
  guildId: string;
  channelId: string;
  type: ECounterType;
  roleId?: string;
}

@Entity()
export class Counter extends BaseEntity implements ICounter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', width: 90 })
  name!: string;

  @Column('varchar')
  emojiId!: string;

  @Column({ type: 'varchar', width: 256 })
  guildId!: string;

  @Column({ type: 'varchar', width: 256 })
  channelId!: string;

  @Column({ type: 'int' })
  type!: ECounterType;

  @Column({ type: 'varchar', width: 256 })
  roleId?: string;
}

export const DELETE_COUNTER_BY_ID = async (id: number) =>
  await Counter.delete({ id });

export const DLETE_ALL_COUNTERS_BY_GUILD_ID = async (guildId: string) =>
  await Counter.delete({ guildId });

export const GET_COUNTERS_BY_GUILD_ID = async (guildId: string) =>
  await Counter.find({ guildId });

export const GET_COUNTER_BY_ID = async (id: number) =>
  await Counter.find({ id });
