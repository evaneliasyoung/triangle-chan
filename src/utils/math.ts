/**
 * @file      math.ts
 * @brief     Math extensions.
 *
 * @author    Evan Elias Young
 * @date      2022-03-08
 * @date      2022-03-08
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

const { floor } = Math;

export const round = (x: number, digits: number = 0) =>
  digits == 0 ? Math.round(x) : Math.round(x * 10 ** digits) / 10 ** digits;

export const iota = (stop: number, step: number = 1) =>
  range(0, stop, step);

export function range(start: number, stop: number, step: number): number[];
export function range(start: number, stop: number, step: void): number[];
export function range(start: number, stop: void, step: void): number[];

export function range(start: any, stop: any, step: any = 1) {
  if (typeof step === 'undefined') step = 1;
  if (typeof stop === 'undefined') stop = start; start = 0;

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];

  let result: number[] = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) result.push(i);
  return result;
};

export const divmod = (x: number, d: number) =>
  [floor(x / d), x % d];

export const next = <T>(iter: T[], it: T) =>
  iter[(iter.indexOf(it) + 1) % iter.length];
