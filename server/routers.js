const user = require('./controllers/user');
const message = require('./controllers/message');
const { requireSignin, requireAuth } = require('./services/passport');
const { SOCKET } = require('../src/configs.client');

module.exports = (app, io) => {
  app.post('/api/user/signup', user.signup);
  app.post('/api/user/signin', requireSignin, user.signin);
  app.get('/api/users', requireAuth, user.fetchAllUsers);
  app.get('/api/messages/:uid', requireAuth, message.fetchMessages);
  app.post('/api/messages/:uid', requireAuth, message.addMessage);

  io.onNewConnection(socket => {
    socket.onRoute(SOCKET.authenticate, user.authenticateSocket);
    socket.onAuthRoute(SOCKET.isTyping, message.isTyping);
  });
}