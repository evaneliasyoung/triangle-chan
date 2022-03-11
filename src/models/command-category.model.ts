/**
 * @file      command-category.model.ts
 * @brief     CommandCategory model.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

export enum ECommandCategory {
  about = 'about',
  general = 'general',
  category = 'category',
  counter = 'counter',
  react = 'react'
}

export type TCommandCategory = keyof typeof ECommandCategory;

export function isCommandCategory(text: any): text is ECommandCategory {
  return typeof text === 'string' && text in ECommandCategory;
};
