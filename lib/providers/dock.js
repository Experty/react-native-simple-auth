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
  { dockUrl },
) => pipeP(
  dance,
  replace('#', '?'),
  fromQueryString,
  set(lensProp('credentials'), __, {}),
)(dockUrl);

export const identify = curry((request, { credentials }) => ({ credentials }));
