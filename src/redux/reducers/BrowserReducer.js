import { BROWSER_IDENTIFY } from '../constants';

const INITIAL_STATE = { safari: false };

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case BROWSER_IDENTIFY:
      return { safari: action.payload };
    default:
      return state;
  }
}