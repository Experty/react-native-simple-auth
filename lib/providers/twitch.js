import {
  __,
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
const AUTH = 'https://www.facebook.com/dialog/oauth';

export const authorize = (
  { dance, request },
  { appId, callback, scope = SCOPE },
) => pipeP(
  dance,
  replace('#', '?'),
  fromQueryString,
  set(lensProp('credentials'), __, {}),
)(authorizationUrl(AUTH, appId, callback, scope));
