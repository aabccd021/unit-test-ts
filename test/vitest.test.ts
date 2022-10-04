import { io, task } from 'fp-ts';
import * as actualVitest from 'vitest';

import { test, expectFail, sequential, skip, Tests, vitest } from '../src';

const simpleTests: Tests = {
  'task pass': test({
    task: task.of('foo'),
    toEqual: 'foo',
  }),
  'task fail': expectFail({
    task: task.of('foo'),
    toEqual: 'bar',
  }),
  'task skip': skip({
    task: task.of('foo'),
    toEqual: 'bar',
  }),
  'io pass': test({
    io: io.of('foo'),
    toEqual: 'foo',
  }),
  'io fail': expectFail({
    io: io.of('foo'),
    toEqual: 'bar',
  }),
  'io skip': skip({
    io: io.of('foo'),
    toEqual: 'bar',
  }),
};

const sequentialTest: Tests = {
  sequential: sequential([
    test({
      task: task.of('foo'),
      toEqual: 'foo',
    }),
    expectFail({
      task: task.of('foo'),
      toEqual: 'bar',
    }),
  ]),
};

vitest.exec({ ...simpleTests, ...sequentialTest }, actualVitest);
