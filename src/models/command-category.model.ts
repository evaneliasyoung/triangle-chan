/**
 * @file      command-category.model.ts
 * @brief     CommandCategory model.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-13
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

export enum ECommandCategory {
  about = 'about',
  general = 'general',
  category = 'category',
  counter = 'counter',
  random = 'random',
  react = 'react',
  role = 'role',
  text = 'text',
}

export type TCommandCategory = keyof typeof ECommandCategory;
