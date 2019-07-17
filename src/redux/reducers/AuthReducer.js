import {
  AUTH_LOADING,
  AUTH_TOKEN_RECEIVED,
  AUTH_SUCCESS,
  AUTH_FAILED,
  AUTH_RESET,
} from '../constants';

const INITIAL_STATE = {
  loading: false,
  token: false,
  user: null,
  socketAuth: false,
  error: false,
}

export default (state = { ...INITIAL_STATE }, action) => {
  switch(action.type) {
    case AUTH_LOADING:
      return {
        loading: true,
        user: null,
        token: false,
        error: false,
      }
    case AUTH_SUCCESS:
      return {
        loading: false,
        user: action.payload,
        token: true,
        error: false,
      }
    case AUTH_FAILED:
      return {
        loading: false,
        user: null,
        token: false,
        error: 'authentication failed'
      }
    case AUTH_TOKEN_RECEIVED:
      return { ...state, token: true }
    case AUTH_RESET:
      return { ...INITIAL_STATE }
    default:
      return state;
  }
}