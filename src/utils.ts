import { applicative, io, readonlyArray, record, void as void_ } from 'fp-ts';

export const mapSequentialTestsWithIndex = readonlyArray.foldMapWithIndex(
  applicative.getApplicativeMonoid(io.Applicative)(void_.Monoid)
);

export const mapTestsWithIndex = record.traverseWithIndex(io.Applicative);
