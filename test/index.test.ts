import { io, task } from 'fp-ts';
import { expect, it } from 'vitest';

import { fail, pass, runTests, skip, Tests } from '../src';

const tests: Tests = {
  'task pass': pass({
    expect: task.of('foo'),
    toEqual: 'foo',
  }),
  'task fail': fail({
    expect: task.of('foo'),
    toEqual: 'bar',
  }),
  'task skip': skip({
    expect: task.of('foo'),
    toEqual: 'bar',
  }),
  'io pass': pass({
    expect: io.of('foo'),
    toEqual: 'foo',
  }),
  'io fail': fail({
    expect: io.of('foo'),
    toEqual: 'bar',
  }),
  'io skip': skip({
    expect: io.of('foo'),
    toEqual: 'bar',
  }),
};

runTests(tests, expect, it);
