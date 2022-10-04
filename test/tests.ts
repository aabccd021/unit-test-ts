import { io, task } from 'fp-ts';
import { pipe } from 'fp-ts/function';

import { behavior, expect, filter, sequentially } from '../src';

const allBehaviors = [
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
    'unit-test-ts can mark todo failing test',
    expect({
      io: io.of('foo'),
      resolvesTo: 'bar',
    })
  ),

  behavior(
    'unit-test-ts can do assert multiple values non concurrently',
    sequentially([
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

  behavior(
    'unit-test-ts can mark todo failing sequential test',
    sequentially([
      expect({
        task: task.of(1),
        resolvesTo: 2,
      }),
      expect({
        io: io.of('baz'),
        resolvesTo: 'bak',
      }),
    ])
  ),
];

export const behaviors = pipe(
  allBehaviors,
  filter({
    'unit-test-ts can assert resolved result of a Task': 'done',
    'unit-test-ts can assert resolved result of an IO': 'done',
    'unit-test-ts can mark todo failing test': 'todo',
    'unit-test-ts can do assert multiple values non concurrently': 'done',
    'unit-test-ts can mark todo failing sequential test': 'todo',
  })
);
