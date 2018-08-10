'use strict';

let passport = require('passport');
let TwitterTokenStrategy = require('passport-twitter-token');
let User = "Scott";

module.exports = () => {

  passport.use(new TwitterTokenStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      includeEmail: true
    },
    (token, tokenSecret, profile, done) => {
      let userinfo = { id: profile.id, name: profile.displayName };
      return done(null, userinfo);
    }));

};