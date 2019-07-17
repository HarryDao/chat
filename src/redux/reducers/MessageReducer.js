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

const INITIAL_STATE = {
  live: null,
  conversationActive: false,
  typing: {},
  messages: {},
};

const addNewMessageToList = (list = [], message) => {
  list = removeNewMessageTag(list);
  list.push({ ...message, isNewMessage: true });
  return list;
}

const removeNewMessageTag = (list = []) => {
  list = JSON.parse(JSON.stringify(list));

  if (
    list[list.length - 1] && 
    list[list.length - 1].isNewMessage
  ) {
    delete list[list.length - 1].isNewMessage;
  }
  return list;
}

export default (state = INITIAL_STATE, action) => {
  let list;

  switch(action.type) {
    case SET_LIVE_USER:
      return {
        ...state,
        live: action.payload,
        conversationActive: true,
      };
    case SWITCH_TO_USERS_PANEL:
        return { ...state, conversationActive: false }
    case FETCH_MESSAGES:
      const { uid, messages } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [uid]: messages
        }
      }
    case SEND_MESSAGE:
      list = addNewMessageToList(
        state.messages[action.payload.to],
        action.payload
      );
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.to]: list
        }
      }
    case RECEIVE_MESSAGE:
      list = addNewMessageToList(
        state.messages[action.payload.from],
        action.payload
      );

      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.from]: list
        }
      }
    case FINISH_RENDER_NEW_MESSAGE:
      list = removeNewMessageTag(state.messages[action.payload]);
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload]: list
        }
      }
    case FRIEND_IS_TYPING:
      return {
        ...state,
        typing: {
          ...state.typing,
          [action.payload]: true
        }
      }
    case FRIEND_STOP_TYPING:
      const typing = { ...state.typing };
      delete typing[action.payload];
      return {
        ...state,
        typing
      }
    default:
      return state;
  }
};