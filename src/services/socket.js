import io from 'socket.io-client';
import { SERVER_URL } from '../configs.client';

export default io(SERVER_URL);