import { Behavior } from './types';

export const filter =
  <N extends string>(_names: { readonly [K in N]: 'done' | 'todo' }) =>
  (behavior: readonly Behavior<N>[]): readonly Behavior<N>[] =>
    behavior;
