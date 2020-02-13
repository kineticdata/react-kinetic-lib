import axios from 'axios';
import { bundle } from '../../helpers';
import { fetchProfile } from '../../apis';
import { handleErrors } from '../http';

export const login = ({ username, password }) =>
  axios
    .post(
      `${bundle.spaceLocation()}/app/login.do`,
      {
        j_username: username,
        j_password: password,
      },
      {
        __bypassAuthInterceptor: true,
      },
    )
    .catch(handleErrors);

export const logoutDirect = () =>
  axios.get(`${bundle.spaceLocation()}/app/logout`);

const checkedOrigin = process.env.REACT_APP_API_HOST
  ? process.env.REACT_APP_API_HOST
  : typeof window !== `undefined` && window.bundle
  ? window.location.origin
  : null;

export const retrieveJwt = () =>
  new Promise(resolve => {
    const iframe = document.createElement('iframe');
    iframe.src =
      bundle.spaceLocation() +
      '/app/oauth/authorize?grant_type=implicit&response_type=token&client_id=system';
    iframe.title = 'oauth jwt iframe';
    iframe.style = 'display: none';

    const listener = e => {
      if (e.origin === checkedOrigin && e.data.token) {
        window.removeEventListener('message', listener);
        document.body.removeChild(iframe);
        resolve(e.data.token);
      }
      if (e.origin === checkedOrigin && e.data.type === 'ping') {
        e.source.postMessage({ type: 'pong' }, e.origin);
      }
    };

    window.addEventListener('message', listener);
    document.body.append(iframe);
  });

export const singleSignOn = (dimensions, target = '_blank') =>
  new Promise(resolve => {
    const options = { ...dimensions, ...getPopupPosition(window, dimensions) };
    const endpoint =
      bundle.spaceLocation() + '/app/saml/login/alias/saml-testing';
    const popup = window.open(endpoint, target, stringifyOptions(options));

    // Create an event handler that closes the popup window if we focus the
    // parent window
    const windowFocusHandler = () => {
      popup.close();
      window.removeEventListener('focus', windowFocusHandler);
    };
    window.addEventListener('focus', windowFocusHandler);

    // use a larger interval in dev mode because we are going to be checking
    // by making an ajax call
    const popupPollingInterval =
      process.env.NODE_ENV === 'development' ? 2000 : 100;

    // Check the status of the popup window.  Was it closed, was it redirected
    // back to the same host as the parent window, othewise try again later.
    const checkPopup = async () => {
      if (popup.closed) {
        resolve({ error: 'Single Sign-on cancelled' });
      } else if (await sameHost(window, popup)) {
        if (
          process.env.NODE_ENV !== 'development' &&
          popup.location.includes === 'authentication_error'
        ) {
          resolve({ error: 'Single Sign-on failed' });
        } else {
          popup.close();
          resolve({});
        }
      } else {
        setTimeout(checkPopup, popupPollingInterval);
      }
    };

    // Start the recursive checkPopup calls.
    setTimeout(checkPopup, popupPollingInterval);
  });

// Checks to see if the parent window and popup window have the same host, wraps
// the check in try/catch because trying to access the location of the popup
// throws an error if it is not the same host but we just want `false`.
const sameHost = async (window, popup) =>
  new Promise(async resolve => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const result = await fetchProfile({ public: true });
        resolve(!!result.profile);
      } else {
        resolve(window.location.host === popup.location.host);
      }
    } catch (e) {
      resolve(false);
    }
  });

// window.open takes a string of options rather than a JS object so we use this
// helper to do that conversion.
const stringifyOptions = options =>
  Object.keys(options)
    .reduce(
      (reduction, option) => [...reduction, `${option}=${options[option]}`],
      [],
    )
    .join(',');

// Given the dimensions of the popup and the parent window returns the correct
// position for the popup to be centered within the parent.
const getPopupPosition = (window, { width, height }) => ({
  top: window.screenY + window.innerHeight / 2 - height / 2,
  left: window.screenX + window.innerWidth / 2 - width / 2,
});
