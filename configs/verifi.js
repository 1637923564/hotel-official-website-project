const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");

const keys = require("./keys");
require("../models/User");
const User = mongoose.model("user");

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User
      .findById(jwt_payload.id)
      .then(user => {
        user ? done(null, user)
             : done(null, false);
      })
      .catch(err => console.log(err.message));
  }));
}