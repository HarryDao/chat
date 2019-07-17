const Passport = require('passport');
const LocalStrategy = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const { TOKEN_SECRET } = require('../../configs.server');

Passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, (err, ok) => {
      if (err) return done(err);
      return done(null, ok ? user : false);
    })
  });
}));

Passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: TOKEN_SECRET
}, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err);
    return done(null, user || false);
  });
}));

exports.requireSignin = Passport.authenticate('local', { session: false });
exports.requireAuth = Passport.authenticate('jwt', { session: false });

