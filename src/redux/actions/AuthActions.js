import Axios from 'axios';
import LS from '../../services/localStorage';
import socket from '../../services/socket';
import socketListeners from './socketListeners';
import {
  SIGN_IN_URL,
  SIGN_UP_URL,
} from '../urls';
import {
  AUTH_LOADING,
  AUTH_TOKEN_RECEIVED,
  AUTH_SUCCESS,
  AUTH_FAILED,
  AUTH_RESET,
  FETCH_ACTIVE_USERS_SUCCESS,
} from '../constants';
import { SOCKET } from '../../configs.client';

export const signIn = ({ username, password }, cb) => dispatch => {

  dispatch({ type: AUTH_LOADING });

  Axios.post(SIGN_IN_URL, { username, password })
  .then(res => onAuthSuccess(res, dispatch))
  .catch(() => {
    Axios.post(SIGN_UP_URL, { username, password })
    .then(res => onAuthSuccess(res, dispatch))
    .catch(err => dispatch({ type: AUTH_FAILED })); 
  });
}

export const initializeAuth = (dispatch) => {
  const token = LS.getToken();
  if (!token) return;
  authenticateSocket(token, dispatch);
}

export const onSocketRouteUnauthorized = (dispatch) => {
  socket.on(SOCKET.unauthorized, (data) => {
    console.log('unauthorized:', data);
  })
}

const onAuthSuccess = ({ data }, dispatch) => {
  const { token } = data;
  LS.saveToken(token);
  authenticateSocket(token, dispatch);
}

const authenticateSocket = (token, dispatch) => {
  dispatch({ type: AUTH_TOKEN_RECEIVED });

  socket.emit(SOCKET.authenticate, { token });

  socket.on(SOCKET.authenticateFailed, () => {
    dispatch({ type: AUTH_RESET });
  });

  socket.on(SOCKET.authenticated, ({ user, active }) => {
    dispatch({
      type: AUTH_SUCCESS,
      payload: user
    });

    dispatch({
      type: FETCH_ACTIVE_USERS_SUCCESS,
      payload: active
    });

    socketListeners(dispatch);
  });
}