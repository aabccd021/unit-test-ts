import { io, record, task } from 'fp-ts';
import { absurd, constant, pipe } from 'fp-ts/function';
import * as std from 'fp-ts-std';
import type { TestAPI } from 'vitest';

export type IOTest<T = unknown> = {
  readonly expectIO: io.IO<T>;
  readonly toEqual: T;
};

export type TaskTest<T = unknown> = {
  readonly expectTask: task.Task<T> | io.IO<T>;
  readonly toEqual: T;
};

export type Test<T = unknown> = TaskTest<T> | IOTest<T>;

export type TestType = 'pass' | 'fail' | 'skip';

type WrappedTest<T = unknown> = {
  readonly type: TestType;
  readonly test: Test<T>;
};

const testWithType =
  (type: TestType) =>
  <T>(test: Test<T>): WrappedTest<T> => ({ type, test });

export const it = testWithType('pass');

export const itFail = testWithType('fail');

export const itSkip = testWithType('skip');

export type Tests = Record<string, WrappedTest>;

const getTesterByType = (type: TestType, it_: TestAPI<unknown>) =>
  type === 'pass'
    ? (name: string, t: task.Task<void>) => constant(it_(name, t))
    : type === 'fail'
    ? (name: string, t: task.Task<void>) => constant(it_.fails(name, t))
    : type === 'skip'
    ? (name: string, t: task.Task<void>) => constant(it_.skip(name, t))
    : absurd<never>(type);

const getExpectByType = (test: Test, expect: Vi.ExpectStatic) =>
  'expectTask' in test
    ? expect(test.expectTask()).resolves.toStrictEqual(test.toEqual)
    : 'expectIO' in test
    ? Promise.resolve(expect(test.expectIO()).toStrictEqual(test.toEqual))
    : absurd<never>(test);

export const runTests = (tests: Tests, vitest: typeof import('vitest')) =>
  pipe(
    tests,
    record.traverseWithIndex(io.Applicative)((testName, { type, test }) =>
      getTesterByType(type, vitest.it)(testName, () => getExpectByType(test, vitest.expect))
    ),
    std.io.execute
  );
