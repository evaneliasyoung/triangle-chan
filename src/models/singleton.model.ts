/**
 * @file      singleton.model.ts
 * @brief     The Singleton decorator.
 */

import {Abstract, Constructor, SafeAny} from './object.types.js';

export const SINGLETON_KEY = Symbol();

export type Singleton<T extends Constructor<SafeAny>> = T & {
  [SINGLETON_KEY]: T extends new (...args: SafeAny[]) => infer I ? I : never;
};

export const Singleton = <T extends Constructor<SafeAny>>(Klass: T) =>
  new Proxy(Klass, {
    construct(target: Singleton<T>, args: SafeAny[], newTarget: Abstract<T>) {
      if (target.prototype !== newTarget.prototype)
        return Reflect.construct(target, args, newTarget);
      return (
        target[SINGLETON_KEY] ??
        (target[SINGLETON_KEY] = Reflect.construct(target, args, newTarget))
      );
    },
  });
