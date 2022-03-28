/**
 * @file      object.types.ts
 * @brief     Object types.
 */
/* eslint @typescript-eslint/no-explicit-any: [0] */

export type Abstract<T> = Function & {prototype: T};
export type Constructor<T> = new (...args: any[]) => T;
export type Class<T> = Abstract<T> | Constructor<T>;
