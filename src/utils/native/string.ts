/**
 * @file      string.ts
 * @brief     String methods.
 */

import {math} from './math.js';

const stringMap = (
  str: string,
  callbackfn: (value: string, index: number, array: string[]) => unknown,
  split = ''
) => str.split(split).map(callbackfn).join(split);

export const toTitleCase = (str: string) =>
  stringMap(
    str,
    word => word.at(0)!.toUpperCase() + word.substring(1).toLowerCase(),
    ' '
  );

export const toRandomCase = (text: string) =>
  stringMap(text, c =>
    math.random.boolean() ? c.toUpperCase() : c.toLocaleLowerCase()
  );

export const remapCharacters = (
  text: string,
  match: string[],
  replace: string[]
) => stringMap(text, c => (match.includes(c) ? replace[match.indexOf(c)] : c));
