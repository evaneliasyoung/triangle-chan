/**
 * @file      command-category.model.ts
 * @brief     CommandCategory model.
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
