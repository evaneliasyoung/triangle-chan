/**
 * @file      random.ts
 * @brief     The random namespace.
 *
 * @author    Evan Elias Young
 * @date      2022-03-08
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

const {random, floor, round} = Math;

export namespace Random {
  export function number(min: void, max: void): number;
  export function number(min: number, max: void): number;
  export function number(min: number, max: number): number;

  export function number(min: any, max: any): number {
    return typeof min === 'number'
      ? typeof max === 'number'
        ? random() * (max - min) + min
        : random() * min
      : random();
  }

  export function integer(min: void, max: void): number;
  export function integer(min: number, max: void): number;
  export function integer(min: number, max: number): number;

  export function integer(min: any, max: any) {
    return (typeof min !== 'number' && typeof max !== 'number' ? round : floor)(
      Random.number(min, max)
    );
  }

  export function boolean(): boolean {
    return Random.integer() === 1;
  }

  export function pick<T>(iterable: T[]): T;
  export function pick<T>(...iterable: T[]): T;

  export function pick<T>(...iterable: T[]): T {
    return iterable[Random.integer(iterable.length)];
  }

  export function picks<T>(amount: number, ...iterable: T[]): T[] {
    let ret = new Set<T>();
    while (ret.size < amount) ret.add(Random.pick<T>(...iterable));
    return Array.from(ret);
  }
}
