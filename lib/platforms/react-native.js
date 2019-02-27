import { Linking, AppState, Platform } from 'react-native'; // eslint-disable-line import/no-unresolved, max-len
import InAppBrowser from 'react-native-inappbrowser-reborn';

const isIOS = Platform.OS === 'ios';
let appStateTimeout;
let previousLinkingCallback;
let previousAppStateCallback;

const cleanup = () => {
  clearTimeout(appStateTimeout);

  if (previousLinkingCallback) {
    Linking.removeEventListener('url', previousLinkingCallback);
    previousLinkingCallback = null;
  }

  if (previousAppStateCallback) {
    AppState.removeEventListener('change', previousAppStateCallback);
    previousAppStateCallback = null;
  }
};


const RNHandler = authUrl => Linking.openURL(authUrl)
  .then(() => new Promise((resolve, reject) => {
    const handleUrl = (url) => {
      if (!url || url.indexOf('fail') > -1) {
        reject(url);
      } else {
        resolve(url);
      }
    };

    const linkingCallback = ({ url }) => {
      cleanup();
      handleUrl(url);
    };

    Linking.addEventListener('url', linkingCallback);
    previousLinkingCallback = linkingCallback;

    const appStateCallback = (state) => {
      // Give time for Linking event to fire.
      appStateTimeout = setTimeout(() => {
        if (state === 'active') {
          cleanup();
          reject('cancelled');
        }
      }, 100);
    };

    AppState.addEventListener('change', appStateCallback);
    previousAppStateCallback = appStateCallback;
  }));

const InAppBrowserHandler = authUrl => InAppBrowser.openAuth(authUrl,
  '', // no need for deeplink arg here
  {
        // iOS Properties
    dismissButtonStyle: 'cancel',
        // Android Properties
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: true,
  })
    .then(response => new Promise((resolve, reject) => {
      if (response.type !== 'success' || !response.url) {
        reject('cancelled');
      }

      const handleUrl = (url) => {
        if (!url || url.indexOf('fail') > -1) {
          reject(url);
        } else {
          resolve(url);
        }
      };

      handleUrl(response.url);
    }));

const promiseWrapper = async (authUrl) => {
  if (!isIOS) {
    return RNHandler(authUrl);
  }

  const majorVersionIOS = parseInt(Platform.Version, 10);
  if (majorVersionIOS < 11) {
    return RNHandler(authUrl);
  }


  const isInAppBrowserAvailable = await InAppBrowser.isAvailable()
    .then(() => true)
    .catch(() => false);

  return isInAppBrowserAvailable
    ? InAppBrowserHandler(authUrl) : RNHandler(authUrl);
};

export const dance = (authUrl) => {
  cleanup();
  return promiseWrapper(authUrl);
};

export const request = fetch;
