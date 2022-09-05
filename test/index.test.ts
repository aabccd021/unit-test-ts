import { io, task } from 'fp-ts';
import * as vitest from 'vitest';

import { executeTests, itExpect, itExpectFail, itSkipExpect, Tests } from '../src';

const tests: Tests = {
  'task pass': itExpect({
    task: task.of('foo'),
    toEqual: 'foo',
  }),
  'task fail': itExpectFail({
    task: task.of('foo'),
    toEqual: 'bar',
  }),
  'task skip': itSkipExpect({
    task: task.of('foo'),
    toEqual: 'bar',
  }),
  'io pass': itExpect({
    io: io.of('foo'),
    toEqual: 'foo',
  }),
  'io fail': itExpectFail({
    io: io.of('foo'),
    toEqual: 'bar',
  }),
  'io skip': itSkipExpect({
    io: io.of('foo'),
    toEqual: 'bar',
  }),
};

executeTests(tests, vitest);
