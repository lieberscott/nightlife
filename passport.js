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
      return done(null, profile.emails[0].value);
    }));

};