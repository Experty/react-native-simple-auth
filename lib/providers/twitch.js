import {
  __,
  curry,
  lensProp,
  pipeP,
  replace,
  set,
} from 'ramda';
import {
  authorizationUrl,
} from '../utils/oauth2';
import { fromQueryString } from '../utils/uri';

const SCOPE = 'user:read:email';
const AUTH = 'https://id.twitch.tv/oauth2/authorize';
const RESPONSE_TYPE = 'code';

export const authorize = (
  { dance, request },
  { appId, callback, scope = SCOPE, responseType = RESPONSE_TYPE },
) => pipeP(
  dance,
  replace('#', '?'),
  fromQueryString,
  set(lensProp('credentials'), __, {}),
)(authorizationUrl(AUTH, appId, callback, scope, responseType));

export const identify = curry((request, { credentials }) => ({ credentials }));
