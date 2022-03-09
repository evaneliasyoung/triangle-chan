/**
 * @file      timeout.ts
 * @brief     Timeout function.
 *
 * @author    Evan Elias Young
 * @date      2022-03-09
 * @date      2022-03-09
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

export const timeout = async (ms: number) => new Promise<never>(resolve => setTimeout(resolve, ms));
