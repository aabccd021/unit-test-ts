import { task } from 'fp-ts';

import { fail, pass, runTests, skip, Tests } from '../src';

const tests: Tests = {
  pass: pass({
    expect: task.of('foo'),
    toEqual: 'foo',
  }),
  fail: fail({
    expect: task.of('foo'),
    toEqual: 'bar',
  }),
  skip: skip({
    expect: task.of('foo'),
    toEqual: 'bar',
  }),
};

runTests(tests);
