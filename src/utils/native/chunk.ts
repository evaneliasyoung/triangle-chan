/**
 * @file      chunk.ts
 * @brief     Splices an iterable into chunks.
 */

export const chunk = <T>(arr: readonly T[], amount: number): T[][] => {
  const result: T[][] = [];
  const copy: T[] = [...arr];
  while (copy.length > 0) result.push(copy.splice(0, amount));
  return result;
};
