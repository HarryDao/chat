const Jwt = require('jwt-simple');
const User = require('../models/User');
const { TOKEN_SECRET } = require('../../configs.server');
const { SOCKET } = require('../../src/configs.client');

const createToken = (user) => Jwt.encode({
  sub: user.id,
  iat: Date.now()
}, TOKEN_SECRET);

const composeUserInfo = ({ id, username }) => ({
  uid: id.toString(),
  username
});

const getUsers = (cb) => {
  User.find({}, (err, users) => {
    if (err) return cb(err);
    return cb(null, users.map(composeUserInfo));
  }); 
}

const onSocketAuthFail = (socket) => {
  socket.emit(SOCKET.authenticateFailed);
}

const broadcastNewUser = (io, user) => {
  const { sockets } = io.sockets;

  for (let id in sockets) {
    if (sockets[id].uid) {
      sockets[id].emit(SOCKET.newUser, composeUserInfo(user));
    }
  };
};

exports.signin = (req, res) => {
  
  return res.status(200).send({ token: createToken(req.user) });
};

exports.signup = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).send('Username and password are required');
  }

  const user = new User({ username, password });

  user.save((err) => {
    if (err) return next(err);
    
    if (req.io) {
      broadcastNewUser(req.io, user);
    }

    return res.status(200).send({ token: createToken(user) });
  });
};

exports.fetchAllUsers = (req, res) => {
  getUsers((err, users) => {
    if (err) return res.sendStatus(500);

    res.status(200).send(users);
  });
}

exports.authenticateSocket = (data, socket, io) => {
  try {
    User.findById(Jwt.decode(data.token, TOKEN_SECRET).sub, (err, user) => {
      if (err || !user) return onSocketAuthFail(socket);
      
      const active = io.registerSocket(socket, user.id.toString());
      
      socket.emit(SOCKET.authenticated, {
        user: composeUserInfo(user),
        active
      });
    }); 
  }
  catch(err) { onSocketAuthFail(socket) };
}