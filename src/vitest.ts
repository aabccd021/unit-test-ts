import { io, task } from 'fp-ts';
import { absurd, pipe } from 'fp-ts/function';
import * as std from 'fp-ts-std';

import { SingleTest, SingleTest, Tests } from '.';
import { mapSequentialTestsWithIndex, mapTestsWithIndex } from './utils';

export type Vitest = typeof import('vitest');

const expectIO =
  ({ test }: SingleTest, vitest: Vitest): task.Task<void> | io.IO<void> =>
  () =>
    'task' in test
      ? vitest.expect(test.task()).resolves.toStrictEqual(test.toEqual)
      : 'io' in test
      ? vitest.expect(test.io()).toStrictEqual(test.toEqual)
      : absurd<never>(test);

const testIO =
  (name: string, test: SingleTest, vitest: Vitest): io.IO<unknown> =>
  () =>
    test.type === 'pass'
      ? vitest.it(name, expectIO(test, vitest))
      : test.type === 'fail'
      ? vitest.it.fails(name, expectIO(test, vitest))
      : test.type === 'skip'
      ? vitest.it.skip(name, expectIO(test, vitest))
      : test.type === 'sequential'
      ? vitest.describe(
          name,
          pipe(
            test.tests,
            mapSequentialTestsWithIndex((seqTestIdx, seqTest) =>
              testIO(seqTestIdx.toString(), seqTest, vitest)
            )
          )
        )
      : absurd<never>(test.type);

export const testsIO = (tests: Tests, vitest: Vitest) =>
  pipe(
    tests,
    mapTestsWithIndex((name, test) => testIO(name, test, vitest))
  );

export const exec = (tests: Tests, vitest: Vitest) => pipe(testsIO(tests, vitest), std.io.execute);
