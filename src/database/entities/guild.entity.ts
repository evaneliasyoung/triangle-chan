/**
 * @file      guild.entity.ts
 * @brief     Guild database entity.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {BaseEntity, PrimaryGeneratedColumn} from 'typeorm';

export interface IGuildConfig {}

export class GuildConfig extends BaseEntity implements IGuildConfig {
  @PrimaryGeneratedColumn()
  id!: number;
}
