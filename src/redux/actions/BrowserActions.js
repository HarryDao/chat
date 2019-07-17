import { BROWSER_IDENTIFY } from '../constants';

export const identifyBrowser = (dispatch) => {
  const browser = navigator.userAgent.toLowerCase();
  const isSafari = browser.includes('safari') &&
    !browser.includes('chrome') &&
    !browser.includes('crios');

  dispatch({
    type: BROWSER_IDENTIFY,
    payload: isSafari
  });
}