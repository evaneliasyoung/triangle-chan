/**
 * @file      string.ts
 * @brief     String methods.
 *
 * @author    Evan Elias Young
 * @date      2022-03-09
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

export const toTitleCase = (str: string) =>
  str
    .split(' ')
    .map(word => word.at(0)!.toUpperCase() + word.substring(1).toLowerCase())
    .join(' ');
