/**
 * @file      category.entity.ts
 * @brief     Role category database entity.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
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
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  guildId!: string;

  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column()
  mutuallyExclusive?: boolean;
}
