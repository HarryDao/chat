import Axios from 'axios';
import LS from '../../services/localStorage';
import socket from '../../services/socket';
import {
  FETCH_USERS_URL
} from '../urls';
import {
  FETCH_USERS_SUCCESS,
  FETCH_ACTIVE_USERS_SUCCESS,
  FETCH_NEW_USER,
} from '../constants';
import { SOCKET } from '../../configs.client';

export const fetchUsers = (cb) => async dispatch => {
  try {
    const { data } = await Axios.get(
      FETCH_USERS_URL,
      LS.createAuthHeader()
    );

    dispatch({
      type: FETCH_USERS_SUCCESS,
      payload: data.reduce((obj, user) => {
        return { ...obj, [user.uid]: user }
      }, {})
    })
  }
  catch(err) {
    return cb(err);
  };
}

export const fetchActiveUsers = (dispatch) => { 
  socket.on(SOCKET.activeUsers, (data) => {
    dispatch({
      type: FETCH_ACTIVE_USERS_SUCCESS,
      payload: data
    });
  });
}

export const fetchNewUser = (dispatch) => {
  socket.on(SOCKET.newUser, (data) => {
    if (!data || !data.uid || !data.username) return;
    dispatch({
      type: FETCH_NEW_USER,
      payload: data
    });
  });
}