/**
 * @file      category.entity.ts
 * @brief     Role category database entity.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-09
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
