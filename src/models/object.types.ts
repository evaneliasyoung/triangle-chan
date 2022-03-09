/**
 * @file      object.types.ts
 * @brief     Object types.
 *
 * @author    Evan Elias Young
 * @date      2022-03-08
 * @date      2022-03-08
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

export type Abstract<T> = Function & { prototype: T; };
export type Constructor<T> = new (...args: any[]) => T;
export type Class<T> = Abstract<T> | Constructor<T>;
