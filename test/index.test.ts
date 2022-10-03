import { io, task } from 'fp-ts';
import * as vitest from 'vitest';

import { execTests, expect, expectFail, skip, Tests } from '../src';

const tests: Tests = {
  'task pass': expect({
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
  'io pass': expect({
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

execTests(tests, vitest);
