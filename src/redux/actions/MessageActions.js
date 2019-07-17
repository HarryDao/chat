import Axios from 'axios';
import LS from '../../services/localStorage';
import socket from '../../services/socket';
import {
  SET_LIVE_USER,
  SWITCH_TO_USERS_PANEL,
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  FINISH_RENDER_NEW_MESSAGE,
  FRIEND_IS_TYPING,
  FRIEND_STOP_TYPING,
} from '../constants';
import { MESSAGES_URL } from '../urls';
import {
  SOCKET,
  TYPING_WAITING_TIME_IN_SECONDS
} from '../../configs.client';
const timeOut = {};

export const setLiveUser = (uid) => {
  return {
    type: SET_LIVE_USER,
    payload: uid,
  };
}

export const switchToUsersPanel = () => {
  return { type: SWITCH_TO_USERS_PANEL }
}

export const fetchMessages = (uid, cb) => async dispatch => {
  try {
    const { data: { messages } } = await Axios.get(
      `${MESSAGES_URL}/${uid}`,
      LS.createAuthHeader()
    );

    dispatch({
      type: FETCH_MESSAGES,
      payload: { uid, messages }
    });

    return cb();
  }
  catch(err) {
    return cb(err);
  }
}

export const sendMessage = (to, content, cb) => async dispatch => {
  try {
    const { data: { message } } = await Axios.post(
      `${MESSAGES_URL}/${to}`,
      { content },
      LS.createAuthHeader()
    );

    dispatch({
      type: SEND_MESSAGE,
      payload: message
    });

    return cb();
  }
  catch(err) {
    return cb(err);
  }
}

export const receiveMessage = (dispatch) => {
  socket.on(SOCKET.newMessage, ({ message }) => {
    dispatch({
      type: RECEIVE_MESSAGE,
      payload: message
    });
    dispatch({
      type: FRIEND_STOP_TYPING,
      payload: message.from
    });
    clearTimeout(timeOut[message.from]);
  });
}

export const finishRenderNewMessage = (uid) => ({
  type: FINISH_RENDER_NEW_MESSAGE,
  payload: uid
});

export const isTyping = (uid) => () => {
  socket.emit(SOCKET.isTyping, uid);
}

export const friendIsTyping = (dispatch) => {
  socket.on(SOCKET.friendIsTyping, uid => {
    clearTimeout(timeOut[uid]);

    dispatch({
      type: FRIEND_IS_TYPING,
      payload: uid
    });

    timeOut[uid] = setTimeout(() => {
      dispatch({
        type: FRIEND_STOP_TYPING,
        payload: uid
      });
    }, TYPING_WAITING_TIME_IN_SECONDS * 1000);
  });
}