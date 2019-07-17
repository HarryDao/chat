const { SOCKET } = require('../../src/configs.client');

const customizeSocket = (socket, io) => {
  socket.on('disconnect', () => {
    io.unregisterSocket(socket);
  });
  
  socket.onRoute = (route, cb) => {
    socket.on(route, data => {
      return cb(data, socket, io);
    });
  }

  socket.onAuthRoute = (route, cb) => {
    socket.on(route, data => {
      if (!socket.uid) {
        return socket.emit(SOCKET.unauthorized, { route });
      }
      return cb(data, socket, io);      
    });
  }

  return socket;
}

exports.customizeIo = (io) => {
  io.onNewConnection = (cb) => {
    io.on('connection', (socket) => {
      return cb(customizeSocket(socket, io));
    });
  }

  io.userMap = {};

  io.registerSocket = (socket, uid) => {
    if (!socket || !uid) return;
    socket.uid = uid;
    if (!io.userMap[socket.uid]) io.userMap[uid] = [];
    io.userMap[uid].push(socket.id);
    
    return io.broadcastActiveUsers();
  }

  io.unregisterSocket = (socket) => {
    if (!socket || !socket.uid || !io.userMap[socket.uid]) return;

    const arr = io.userMap[socket.uid];
    const index = arr.indexOf(socket.id);
    if (index > -1) {
      io.userMap[socket.uid].splice(index, 1);
    }

    if (!arr.length) {
      delete io.userMap[socket.uid];
    }

    io.broadcastActiveUsers();
  }

  io.findSockets = (uids = [], filter = () => true) => {
    if (typeof uids === 'string') uids = [uids];
    const { sockets: { sockets }, userMap } = io;

    return uids.reduce((arr, uid) => {
      if (userMap[uid]) {
        userMap[uid].forEach(id => {
          if (sockets[id] && filter(sockets[id])) {
            arr.push(sockets[id]);
          }
        });
      }
      return arr;
    }, []);
  }

  io.broadcastActiveUsers = () => {
    const active = Object.keys(io.userMap);
    const { sockets } = io.sockets;

    for (let uid in io.userMap) {
      io.userMap[uid].forEach(id => {
        if (sockets && sockets[id]) {
          sockets[id].emit(SOCKET.activeUsers, active);
        }
      });
    }

    return active;
  }
}
