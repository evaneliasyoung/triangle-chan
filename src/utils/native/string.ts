/**
 * @file      string.ts
 * @brief     String methods.
 *
 * @author    Evan Elias Young
 * @date      2022-03-09
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {Random} from './random.js';

const stringMap = (
  str: string,
  callbackfn: (value: string, index: number, array: string[]) => any,
  split: string = ''
) => str.split(split).map(callbackfn).join(split);

export const toTitleCase = (str: string) =>
  stringMap(
    str,
    word => word.at(0)!.toUpperCase() + word.substring(1).toLowerCase(),
    ' '
  );

export const toRandomCase = (text: string) =>
  stringMap(text, c =>
    Random.boolean() ? c.toUpperCase() : c.toLocaleLowerCase()
  );

export const remapCharacters = (
  text: string,
  match: string[],
  replace: string[]
) => stringMap(text, c => (match.includes(c) ? replace[match.indexOf(c)] : c));
