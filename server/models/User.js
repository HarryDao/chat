const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');

const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

userSchema.pre('save', function(next) {
  Bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    Bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(input, cb) {
  Bcrypt.compare(input, this.password, (err, ok) => cb(err, ok));
};

module.exports = Mongoose.model('user', userSchema);