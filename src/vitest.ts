import { io, readonlyArray } from 'fp-ts';
import { absurd, pipe } from 'fp-ts/function';

import { Behavior, SingleAssert } from '.';
import { mapSequentialTestsWithIndex } from './utils';

export type Vitest = typeof import('vitest');

const runExpect = (assertion: SingleAssert, vitest: Vitest) => () =>
  'task' in assertion
    ? vitest.expect(assertion.task()).resolves.toStrictEqual(assertion.resolvesTo)
    : 'io' in assertion
    ? vitest.expect(assertion.io()).toStrictEqual(assertion.resolvesTo)
    : absurd<never>(assertion);

const runBehavior =
  ({ name, assertion }: Behavior, vitest: Vitest) =>
  () =>
    assertion.type === 'single'
      ? assertion.concurrent
        ? vitest.test.concurrent(name, runExpect(assertion.assertion, vitest))
        : vitest.test(name, runExpect(assertion.assertion, vitest))
      : assertion.type === 'sequential'
      ? vitest.describe(
          name,
          pipe(
            assertion.assertion,
            mapSequentialTestsWithIndex(
              (seqTestIdx, seqTest) => (): unknown =>
                vitest.test(seqTestIdx.toString(), runExpect(seqTest.assertion, vitest))
            )
          )
        )
      : absurd<never>(assertion);

export const runVitest = (vitest: Vitest) => (behaviors: readonly Behavior[]) =>
  pipe(
    behaviors,
    readonlyArray.traverse(io.Applicative)((behavior) => runBehavior(behavior, vitest))
  );
