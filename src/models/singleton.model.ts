/**
 * @file      singleton.model.ts
 * @brief     The Singleton decorator.
 *
 * @author    Evan Elias Young
 * @date      2022-03-08
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { Abstract, Constructor } from './object.types.js';

export const SINGLETON_KEY = Symbol();

export type Singleton<T extends Constructor<any>> = T & {
  [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never;
};

export const Singleton = <T extends Constructor<any>>(Klass: T) =>
  new Proxy(Klass, {
    construct(target: Singleton<T>, args: any[], newTarget: Abstract<T>) {
      if (target.prototype !== newTarget.prototype) return Reflect.construct(target, args, newTarget);
      return target[SINGLETON_KEY] ?? (target[SINGLETON_KEY] = Reflect.construct(target, args, newTarget));
    }
  });
