/**
 * @file      timeout.ts
 * @brief     Timeout function.
 */

export const timeout = async (ms: number) =>
  new Promise<never>(resolve => setTimeout(resolve, ms));
