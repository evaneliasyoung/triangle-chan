/**
 * @file      splice-into-chunks.ts
 * @brief     Splices an iterable into chunks.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

export const spliceIntoChunks = <T>(arr: readonly T[], amount: number): T[][] => {
  const result: T[][] = [];
  const copy: T[] = [...arr];
  while (copy.length > 0) result.push(copy.splice(0, amount));
  return result;
};
