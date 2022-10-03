/* eslint-disable no-use-before-define */
import { applicative, io, readonlyArray, record, task, void as void_ } from 'fp-ts';
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

export type SingleTest<T = unknown> = {
  readonly type: TestType;
  readonly test: Test<T>;
};

export type SequentialTest = {
  readonly type: 'sequential';
  readonly tests: readonly SingleTest[];
};

export const sequential = (tests: readonly SingleTest[]): SequentialTest => ({
  type: 'sequential',
  tests,
});

export type Testable = SequentialTest | SingleTest;

export type Tests = Record<string, Testable>;

const testWithType =
  (type: TestType) =>
  <T>(test: Test<T>): SingleTest<T> => ({ type, test });

export const expect = testWithType('pass');

export const expectFail = testWithType('fail');

export const skip = testWithType('skip');

export type Vitest = typeof import('vitest');

const mapSequentialTestsWithIndex = readonlyArray.foldMapWithIndex(
  applicative.getApplicativeMonoid(io.Applicative)(void_.Monoid)
);

const lazySingleTest = (name: string, test: Testable, vitest: Vitest): io.IO<unknown> =>
  constant(
    test.type === 'pass'
      ? vitest.it(name, lazyExpect(test, vitest))
      : test.type === 'fail'
      ? vitest.it.fails(name, lazyExpect(test, vitest))
      : test.type === 'skip'
      ? vitest.it.skip(name, lazyExpect(test, vitest))
      : test.type === 'sequential'
      ? vitest.describe(
          name,
          pipe(
            test.tests,
            mapSequentialTestsWithIndex((testIndex, seqTest) =>
              lazySingleTest(testIndex.toString(), seqTest, vitest)
            )
          )
        )
      : absurd<never>(test.type)
  );

const lazyExpect =
  ({ test }: SingleTest, vitest: Vitest): task.Task<void> | io.IO<void> =>
  () =>
    'task' in test
      ? vitest.expect(test.task()).resolves.toStrictEqual(test.toEqual)
      : 'io' in test
      ? vitest.expect(test.io()).toStrictEqual(test.toEqual)
      : absurd<never>(test);

const mapTestsWithIndex = record.traverseWithIndex(io.Applicative);

export const lazyTests = (tests: Tests, vitest: Vitest) =>
  pipe(
    tests,
    mapTestsWithIndex((name, test) => lazySingleTest(name, test, vitest))
  );

export const execTests = (tests: Tests, vitest: Vitest) =>
  pipe(lazyTests(tests, vitest), std.io.execute);
