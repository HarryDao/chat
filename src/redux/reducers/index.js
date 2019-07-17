import { combineReducers } from 'redux';
import browser from './BrowserReducer';
import auth from './AuthReducer';
import users from './UsersReducer';
import message from './MessageReducer';

export default combineReducers({
  browser,
  auth,
  users,
  message,
});