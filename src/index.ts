import { io, record, task } from 'fp-ts';
import { absurd, constant, pipe } from 'fp-ts/function';
import * as std from 'fp-ts-std';
import type { TestAPI } from 'vitest';

export type IOTest<T = unknown> = {
  readonly io: io.IO<T>;
  readonly toEqual: T;
};

export type TaskTest<T = unknown> = {
  readonly task: task.Task<T> | io.IO<T>;
  readonly toEqual: T;
};

export type Test<T = unknown> = TaskTest<T> | IOTest<T>;

export type TestType = 'pass' | 'fail' | 'skip';

type WrappedTest<T = unknown> = {
  readonly type: TestType;
  readonly test: Test<T>;
};

export type Tests = Record<string, WrappedTest>;

const testWithType =
  (type: TestType) =>
  <T>(test: Test<T>): WrappedTest<T> => ({ type, test });

export const itExpect = testWithType('pass');

export const itExpectFail = testWithType('fail');

export const itSkipExpect = testWithType('skip');

const getItByType = (type: TestType, it: TestAPI<unknown>) =>
  type === 'pass'
    ? (name: string, t: task.Task<void>) => constant(it(name, t))
    : type === 'fail'
    ? (name: string, t: task.Task<void>) => constant(it.fails(name, t))
    : type === 'skip'
    ? (name: string, t: task.Task<void>) => constant(it.skip(name, t))
    : absurd<never>(type);

const getExpectByType = (test: Test, expect: Vi.ExpectStatic) =>
  'task' in test
    ? expect(test.task()).resolves.toStrictEqual(test.toEqual)
    : 'io' in test
    ? Promise.resolve(expect(test.io()).toStrictEqual(test.toEqual))
    : absurd<never>(test);

export const executeTests = (tests: Tests, vitest: typeof import('vitest')) =>
  pipe(
    tests,
    record.traverseWithIndex(io.Applicative)((testName, { type, test }) =>
      getItByType(type, vitest.it)(testName, () => getExpectByType(test, vitest.expect))
    ),
    std.io.execute
  );
