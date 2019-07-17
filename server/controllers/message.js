const Message = require('../models/Message');
const { SOCKET } = require('../../src/configs.client');

exports.fetchMessages = (req, res) => {
  const { user } = req;
  const { uid } = req.params;

  if (!uid) return res.status(422).send('Friend id is required');

  Message.find({
    $or: [
      { from: user.id, to:uid  },
      { from: uid, to: user.id }
    ]
  }, (err, messages) => {
    if (err) return res.sendStatus(500);
    return res.status(200).send({ messages });
  })
}

exports.addMessage = (req, res) => {
  const { content } = req.body;
  const from = req.user.id;
  const to = req.params.uid;
  if (!to || !content) return res.status(422).send('Invalid message');

  const newMessage = new Message({
    from,
    to,
    content,
    time: Date.now()
  });

  newMessage.save((err) => {
    if (err) return res.status(500).send(err);

    if (req.io) {
      req.io.findSockets(to).forEach(socket => {
        socket.emit(SOCKET.newMessage, { message: newMessage });
      });
    }

    return res.status(200).send({ message: newMessage });
  });
}

exports.isTyping = (uid, socket, io) => {
  if (!uid) return;

  io.findSockets(uid).forEach(friendSocket => {
    friendSocket.emit(SOCKET.friendIsTyping, socket.uid);
  });
}