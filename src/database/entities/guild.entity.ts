/**
 * @file      guild.entity.ts
 * @brief     Guild database entity.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GuildConfig extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
}
