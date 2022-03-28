/**
 * @file      math.ts
 * @brief     Math extensions.
 */

export const math = {
  round: (x: number, digits: void | number) =>
    typeof digits === 'number' && digits > 0
      ? Math.round(x * 10 ** digits) / 10 ** digits
      : Math.round(x),

  range: (start: void | number, stop: void | number, step = 1) => {
    if (typeof step === 'undefined') step = 1;
    if (typeof stop === 'undefined') stop = start;
    start = 0;

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];

    const result: number[] = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step)
      result.push(i);
    return result;
  },

  iota: (stop: number, step = 1) => math.range(0, stop, step),

  divmod: (x: number, d: number) => [Math.floor(d / x), x % d],

  next: <T>(iter: T[], it: T) => iter[(iter.indexOf(it) + 1) % iter.length],

  random: {
    random: () => Math.random(),
    number: (min: void | number, max: void | number) =>
      typeof min === 'number'
        ? typeof max === 'number'
          ? Math.random() * (max - min) + min
          : Math.random() * min
        : Math.random(),

    integer: (min: void | number, max: void | number) =>
      (typeof min !== 'number' && typeof max !== 'number'
        ? Math.round
        : Math.floor)(math.random.number(min, max)),

    boolean: () => math.random.integer() === 1,

    pick: <T>(...iterable: T[]) =>
      iterable[math.random.integer(iterable.length)],

    picks: <T>(amount: number, ...iterable: T[]) => {
      const ret = new Set<T>();
      while (ret.size < amount) ret.add(math.random.pick<T>(...iterable));
      return Array.from(ret);
    },
  },
};
