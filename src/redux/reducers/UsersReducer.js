import {
  FETCH_USERS_SUCCESS,
  FETCH_ACTIVE_USERS_SUCCESS,
  FETCH_NEW_USER,
} from '../constants';

const INITIAL_STATE = {
  users: {},
  active: [],
};

export default (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch(action.type) {
    case FETCH_USERS_SUCCESS:
      return { ...state, users: payload };
    case FETCH_ACTIVE_USERS_SUCCESS:
      return { ...state, active: payload };
    case FETCH_NEW_USER:
      return {
        ...state,
        users: {
          ...state.users,
          [payload.uid]: payload
        }
      }
    default:
      return state;
  }
}