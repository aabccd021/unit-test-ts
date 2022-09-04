import { task } from 'fp-ts';
import { absurd, constant } from 'fp-ts/function';
import { expect as expect_, it as it__ } from 'vitest';

export type Test<T = unknown> = {
  readonly expect: task.Task<T>;
  readonly toEqual: T;
};

export type TestType = 'pass' | 'fail' | 'skip';

type WrappedTest<T = unknown> = {
  readonly type: TestType;
  readonly test: Test<T>;
};

const testWithType =
  (type: TestType) =>
  <T>(test: Test<T>): WrappedTest<T> => ({ type, test });

export const pass = testWithType('pass');

export const fail = testWithType('fail');

export const skip = testWithType('skip');

export type Tests = Record<string, WrappedTest>;

const getTesterByType = (type: TestType) =>
  type === 'pass'
    ? (name: string, t: task.Task<void>) => constant(it__(name, t))
    : type === 'fail'
    ? (name: string, t: task.Task<void>) => constant(it__.fails(name, t))
    : type === 'skip'
    ? (name: string, t: task.Task<void>) => constant(it__.skip(name, t))
    : absurd<never>(type);

export const runTests = (tests: Tests) =>
  Object.entries(tests).map(
    ([
      testName,
      {
        type,
        test: { expect: actual, toEqual: expected },
      },
    ]) => getTesterByType(type)(testName, () => expect_(actual()).resolves.toStrictEqual(expected))
  );
