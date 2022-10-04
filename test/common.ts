import { io, task } from 'fp-ts';

import { behavior, expect, sequential } from '../src';

export const behaviors = [
  behavior(
    'unit-test-ts can assert resolved result of a Task',
    expect({
      task: task.of('foo'),
      resolvesTo: 'foo',
    })
  ),

  behavior(
    'unit-test-ts can assert resolved result of an IO',
    expect({
      io: io.of('bar'),
      resolvesTo: 'bar',
    })
  ),

  behavior(
    'unit-test-ts can do assert multiple values non concurrently',
    sequential([
      expect({
        task: task.of(1),
        resolvesTo: 1,
      }),
      expect({
        io: io.of('baz'),
        resolvesTo: 'baz',
      }),
    ])
  ),
];
