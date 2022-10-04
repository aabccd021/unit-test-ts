import { pipe } from 'fp-ts/function';
import * as std from 'fp-ts-std';
import * as vitest from 'vitest';

import { runVitest } from '../src';
import { test } from './tests';

const main = pipe(test, runVitest(vitest));

std.io.execute(main);
