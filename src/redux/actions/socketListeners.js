import {
  fetchActiveUsers,
  fetchNewUser,
} from './UsersActions';
import {
  receiveMessage,
  friendIsTyping,
} from './MessageActions';

export default (dispatch) => {
  fetchActiveUsers(dispatch);
  fetchNewUser(dispatch);
  receiveMessage(dispatch);
  friendIsTyping(dispatch); 
}