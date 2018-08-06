import dotenv from 'dotenv';
dotenv.config();
import config from './config';
import express from 'express';
import fetch from 'node-fetch';
import mon from 'mongodb';
import passport from 'passport';
import session from 'express-session';
import TwitterStrategy from 'passport-twitter';



// import apiRouter from './api';
// import sassMiddleware from 'node-sass-middleware';
// import path from 'path';

const app = express();
const mongo = mon.MongoClient;
const ObjectID = mon.ObjectID;

app.use(express.static('public'));
// app.use('/api', apiRouter);

// app.use(sassMiddleware({ // not using SASS because it wasn't working with Bootstrap/React Components
//   src: path.join(__dirname, 'sass'),
//   dest: path.join(__dirname, 'public')
// }));

app.use(session({
  secret: process.env.SECRET, // make this SECRET in .env file
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');

app.listen(config.port, () => {
  console.log("Express listening on port " + config.port);
});

mongo.connect(process.env.DATABASE, { useNewUrlParser: true }, (err, client) => {

  if (err) { console.log("Database error: " + err); }
  else {
    let db = client.db('freecodecamp2018');
    console.log("Successful database connection");

    // serialization and app.listen
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      done(null, user.id);
    });

    passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_ID,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:8080/auth/twitter/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      cb(null, profile);
    }))

  }

  app.get('/', async (req, res) => {

    if (req.session.passport && req.session.passport.user) { // need both because otherwise will be undefined and will break
      res.render(process.cwd() + '/views/public/index', { signedIn: true, name: req.session.display_name });
    }
    else {
      res.render(process.cwd() + '/views/public/index', { signedIn: false });
    }
  });

  app.get('/api', async (req, res) => {
    let lat = req.query.lat; // 49.32413
    let lon = req.query.lon; // 11.32414
    let loc = req.query.loc; // boston,ma
    let data;


    if (loc) { // api with location from search input
      await fetch('https://api.yelp.com/v3/businesses/search?categories=nightlife&limit=50&location=' + loc, {
        headers: {
          Authorization: 'Bearer ' + process.env.YELP_API_KEY
        }
      })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        data = json;
        return;
      })
      .catch(err => console.log(err));
    }
    else { // api call with lat and lon
      await fetch('https://api.yelp.com/v3/businesses/search?categories=nightlife&limit=50&latitude=' + lat + "&longitude=" + lon, {
        headers: {
          Authorization: 'Bearer ' + process.env.YELP_API_KEY
        }
      })
      .then((res) => res.json())
      .then((json) => {
        data = json;
        return;
      })
      .catch(err => console.log(err));
    }

    res.send({ data: data.businesses });
  });

  app.route('/auth/twitter')
  .get(passport.authenticate('twitter'), (req, res) => {
    res.redirect('/');
  });

  app.route('/auth/twitter/callback')
  .get(passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
    req.session.user_id = req.user.id; // number
    req.session.display_name = req.user.displayName || ""; // Scott Lieber
    req.session.username = req.user.username || ""; // lieberscott
    req.session.provider = req.user.provider || ""; // twitter
    res.redirect('/');
  });

  app.route('/mongo')
  .post((req, res) => {
    db.collection('bars').update(
      { yelp_id: yelp_id },
      { $addToSet: { going: name } },
      { upsert: true },
      (err, data) => {
        if (err) { console.log(err); }
        else {
          // do something?
        }
      }
    )
  })

});
