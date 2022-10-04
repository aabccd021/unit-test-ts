import { io, readonlyArray } from 'fp-ts';
import { absurd, pipe } from 'fp-ts/function';

import { AsyncableSingleAssert, Behavior, SingleAssert, Test } from '.';
import { mapSequentialTestsWithIndex } from './utils';

export type Vitest = typeof import('vitest');

const runExpect = (assertion: SingleAssert, vitest: Vitest) => () =>
  'task' in assertion
    ? vitest.expect(assertion.task()).resolves.toStrictEqual(assertion.resolvesTo)
    : 'io' in assertion
    ? vitest.expect(assertion.io()).toStrictEqual(assertion.resolvesTo)
    : absurd<never>(assertion);

const getAsyncableVitestTest = (
  assertion: AsyncableSingleAssert,
  vitest: Vitest
): ((name: string, f: () => unknown) => unknown) =>
  assertion.concurrent
    ? assertion.todo
      ? vitest.test.concurrent.fails
      : vitest.test.concurrent
    : assertion.todo
    ? vitest.test.fails
    : vitest.test;

const getSyncVitestTest = (
  todo: boolean,
  vitest: Vitest
): ((name: string, f: () => unknown) => unknown) => (todo ? vitest.test.fails : vitest.test);

const runBehavior =
  (vitest: Vitest) =>
  ({ name, assertion }: Behavior) =>
  () =>
    assertion.type === 'single'
      ? getAsyncableVitestTest(assertion, vitest)(name, runExpect(assertion.assertion, vitest))
      : assertion.type === 'sequential'
      ? vitest.describe(
          name,
          pipe(
            assertion.assertion,
            mapSequentialTestsWithIndex(
              (seqTestIdx, seqTest) => (): unknown =>
                getSyncVitestTest(assertion.todo, vitest)(
                  seqTestIdx.toString(),
                  runExpect(seqTest.assertion, vitest)
                )
            )
          )
        )
      : absurd<never>(assertion);

export const runVitest =
  (vitest: Vitest) =>
  ({ hook, behaviors }: Test) =>
    pipe(
      io.Do,
      io.chainFirst((_) => (): unknown => vitest.beforeEach(hook.beforeEach)),
      io.chainFirst((_) =>
        pipe(behaviors, readonlyArray.traverse(io.Applicative)(runBehavior(vitest)))
      )
    );
