/**
 * @file      guild.entity.ts
 * @brief     Guild database entity.
 */

import {BaseEntity, PrimaryGeneratedColumn} from 'typeorm';

// export interface IGuildConfig {}

export class GuildConfig extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
}
