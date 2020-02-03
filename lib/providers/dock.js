import {
  __,
  curry,
  lensProp,
  pipeP,
  replace,
  set,
} from 'ramda';
import { fromQueryString } from '../utils/uri';

export const authorize = (
  { dance, request },
  { socialUrl },
) => pipeP(
  dance,
  replace('#', '?'),
  fromQueryString,
  set(lensProp('credentials'), __, {}),
)(socialUrl);

export const identify = curry((request, { credentials }) => ({ credentials }));
