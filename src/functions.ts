import { identity, readonlyArray, readonlyRecord, string } from 'fp-ts';
import { pipe } from 'fp-ts/function';

import { Behavior } from './types';

export const filter =
  <N extends string>(names: { readonly [K in N]: 'done' | 'todo' }) =>
  (behaviors: readonly Behavior<N>[]): readonly Behavior<N>[] =>
    pipe(
      identity.Do,
      identity.bind('doneBehaviors', (_) =>
        pipe(
          names,
          readonlyRecord.filter((status) => status === 'done'),
          readonlyRecord.keys
        )
      ),
      identity.chain(({ doneBehaviors }) =>
        pipe(
          behaviors,
          readonlyArray.filter((behavior) =>
            readonlyArray.elem(string.Eq)(behavior.name)(doneBehaviors)
          )
        )
      )
    );
