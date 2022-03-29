/**
 * @file      string.test.ts
 * @brief     Test string utilities.
 */

import {
  toRandomCase,
  toTitleCase,
  remapCharacters,
} from '../../../src/utils/native/string';

test('toTitleCase', () => {
  const input = 'to title case';
  const output = toTitleCase(input);
  const expected = 'To Title Case';
  expect(output).toBe(expected);
});

test('toRandomCase', () => {
  const numTests = 1000;
  const input = 'to random case';

  const toSum = (acc: number, element: number) => acc + element;

  const outputs = new Array(numTests).fill(0).map(() => toRandomCase(input));
  const caseRatio =
    outputs
      .map(
        str =>
          [...str]
            .map(char => char.toUpperCase() === char)
            .map(bool => Number(bool))
            .reduce(toSum) / str.length
      )
      .reduce(toSum) / numTests;

  expect(caseRatio).toBeLessThanOrEqual(0.6);
  expect(caseRatio).toBeGreaterThanOrEqual(0.4);
});

test('remapCharacters', () => {
  const input = 'remaps';
  const output = remapCharacters(input, [...input], [...'python']);
  const expected = 'python';
  expect(output).toBe(expected);
});
