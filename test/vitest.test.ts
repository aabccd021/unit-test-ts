import { pipe } from 'fp-ts/function';
import * as std from 'fp-ts-std';
import * as vitest from 'vitest';

import { runVitest } from '../src';
import { behaviors } from './common';

const main = pipe(behaviors, runVitest(vitest));

std.io.execute(main);
