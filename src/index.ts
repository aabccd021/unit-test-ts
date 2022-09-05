import { io, record, task } from 'fp-ts';
import { absurd, constant, pipe } from 'fp-ts/function';
import * as std from 'fp-ts-std';

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

export const expect = testWithType('pass');

export const expectFail = testWithType('fail');

export const skip = testWithType('skip');

export type Vitest = typeof import('vitest');

const getItByType = (type: TestType, vitest: Vitest) =>
  type === 'pass'
    ? (name: string, t: task.Task<void>) => constant(vitest.it(name, t))
    : type === 'fail'
    ? (name: string, t: task.Task<void>) => constant(vitest.it.fails(name, t))
    : type === 'skip'
    ? (name: string, t: task.Task<void>) => constant(vitest.it.skip(name, t))
    : absurd<never>(type);

const getExpectByType = (test: Test, vitest: Vitest) =>
  'task' in test
    ? vitest.expect(test.task()).resolves.toStrictEqual(test.toEqual)
    : 'io' in test
    ? Promise.resolve(vitest.expect(test.io()).toStrictEqual(test.toEqual))
    : absurd<never>(test);

export const executeTests = (tests: Tests, vitest: Vitest) =>
  pipe(
    tests,
    record.traverseWithIndex(io.Applicative)((testName, { type, test }) =>
      getItByType(type, vitest)(testName, () => getExpectByType(test, vitest))
    ),
    std.io.execute
  );
