import { io, task } from 'fp-ts';

export type IOExpectPretty<T> = {
  readonly expectIO: io.IO<T>;
  readonly toEqual: T;
};

export type IOExpect<T> = {
  readonly type: 'io';
  readonly expectIO: io.IO<T>;
  readonly toEqual: T;
};

export type SingleAssert<T = unknown> =
  | {
      readonly task: task.Task<T>;
      readonly resolvesTo: T;
    }
  | {
      readonly io: io.IO<T>;
      readonly resolvesTo: T;
    };

export type AsyncableSingleAssert = {
  readonly type: 'single';
  readonly concurrent: boolean;
  readonly todo: boolean;
  readonly assertion: SingleAssert;
};

export type SyncTaggedSingleAssert = {
  readonly type: 'single';
  readonly assertion: SingleAssert;
};

export type SequentialAssert = ReadonlyArray<SyncTaggedSingleAssert> & {
  readonly 0: SyncTaggedSingleAssert;
  readonly 1: SyncTaggedSingleAssert;
};

export type TaggedSequentialAssert = {
  readonly type: 'sequential';
  readonly todo: boolean;
  readonly assertion: SequentialAssert;
};

export const expect = <T>(assertion: SingleAssert<T>): AsyncableSingleAssert => ({
  type: 'single',
  concurrent: true,
  todo: false,
  assertion,
});

export const sequentially = (assertion: SequentialAssert): TaggedSequentialAssert => ({
  type: 'sequential',
  todo: false,
  assertion,
});

export type TaggedAssert = AsyncableSingleAssert | TaggedSequentialAssert;

export type Behavior<N extends string = string> = {
  readonly name: N;
  readonly assertion: TaggedAssert;
};

export const behavior = <N extends string>(name: N, assertion: TaggedAssert): Behavior<N> => ({
  name,
  assertion,
});

export type NameOf<T> = T extends Behavior<infer N> ? N : never;

export type NamesOf<TS> = TS extends readonly Behavior<infer N>[] ? N : never;

export type Hook = {
  readonly beforeEach: task.Task<task.Task<unknown>>;
};

export type Test = {
  readonly behaviors: readonly Behavior[];
  readonly hook: Hook;
};
