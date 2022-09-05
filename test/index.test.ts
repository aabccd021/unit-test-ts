import { io, task } from 'fp-ts';
import * as vitest from 'vitest';

import { it, itFail, itSkip, runTests, Tests } from '../src';

const tests: Tests = {
  'task pass': it({
    expectTask: task.of('foo'),
    toEqual: 'foo',
  }),
  'task fail': itFail({
    expectTask: task.of('foo'),
    toEqual: 'bar',
  }),
  'task skip': itSkip({
    expectTask: task.of('foo'),
    toEqual: 'bar',
  }),
  'io pass': it({
    expectIO: io.of('foo'),
    toEqual: 'foo',
  }),
  'io fail': itFail({
    expectIO: io.of('foo'),
    toEqual: 'bar',
  }),
  'io skip': itSkip({
    expectIO: io.of('foo'),
    toEqual: 'bar',
  }),
};

runTests(tests, vitest);
