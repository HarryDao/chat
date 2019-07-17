const Mongoose = require('mongoose');

const Message = new Mongoose.Schema({
  from: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  to: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true,
  }
});

module.exports = Mongoose.model('message', Message);