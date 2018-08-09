const mongo = require('mongodb').MongoClient;
const express = require('express');
const app = express();

const bodyparser = require('body-parser');
const expressJwt = require('express-jwt');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const request = require('request');

// passport configuration (from passport.js file)
const passportConfig = require('./passport');
passportConfig();

// cors
const cors = require('cors');
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// body parser
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(bodyparser.json());

// jsonwebtokens functions
const createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, process.env.SECRET,
  {
    expiresIn: 60 * 120
  });
};

const generateToken =  function(req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

const sendToken = function(req, res) {
  res.setHeader('x-auth-token', req.token);
  console.log("user : ", req.user);
  return res.status(200).send(JSON.stringify(req.user));
};

const authenticate = expressJwt({
  secret: process.env.SECRET,
  requestProperty: 'auth',
  getToken: (req) => {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

app.use(express.static('public'));

mongo.connect(process.env.DATABASE, (err, client) => {
  if(err) { console.log('Database error: ' + err); }
  
  let db = client.db('freecodecamp2018');
  db.collection("bars").createIndex( { "expireAt": 1 }, { expireAfterSeconds: 20 } );

  app.get("/", (req, res) => {
    res.sendFile(__dirname + '/app/index.html');
  });

  app.get('/api', async (req, res) => {
    let lat = req.query.lat; // 49.32413
    let lon = req.query.lon; // 11.32414
    let loc = req.query.loc; // boston,ma
    let data;
    let mongodocs = [];
    let yelp_ids = [];


    if (loc) { // api with location from search input
      await fetch('https://api.yelp.com/v3/businesses/search?categories=nightlife&limit=50&location=' + loc, {
        headers: {
          Authorization: 'Bearer ' + process.env.YELP_API_KEY
        }
      })
      .then((res) => res.json())
      .then((json) => {
        data = json;
        yelp_ids = json.businesses.map((bar) => {
          return bar.id;
        });

        // 'find' returns a cursor, must then use forEach to get each document's content
        let cursor = db.collection('bars').find({ 'yelp_id': { $in: yelp_ids } });

        cursor.forEach((doc) => { // get documents from mongodb, then match them with yelp_api doc
          return mongodocs.push(doc); // first, put each mongo doc's info into data2 variable
        }, () => { // second, match the returns from mongo with the yelp api docs
          for (let i = 0; i < data.businesses.length; i++) {
            data.businesses[i].user_names = [];
            for (let j = mongodocs.length - 1; j >= 0; j--) {
              if (mongodocs[j].yelp_id == data.businesses[i].id) { // if the mongodoc.yelp_id == yelp_api.id
                data.businesses[i].user_names = mongodocs[j].user_names; // add the user_names array to the yelp_api document (this will be used to calc # RSVP'd)
                mongodocs.splice(j, 1); // once matched, splice that record for efficiency
                break;
              }
            }
          }
          res.send({ data: data.businesses });
        })
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
        yelp_ids = json.businesses.map((bar) => {
          return bar.id;
        });
        
        // 'find' returns a cursor, must then use forEach to get each document's content
        let cursor = db.collection('bars').find({ 'yelp_id': { $in: yelp_ids } });

        cursor.forEach((doc) => { // get documents from mongodb, then match them with yelp_api doc
          return mongodocs.push(doc); // first, put each mongo doc's info into data2 variable
        }, () => { // second, match the returns from mongo with the yelp api docs
          for (let i = 0; i < data.businesses.length; i++) {
            data.businesses[i].user_names = [];
            for (let j = mongodocs.length - 1; j >= 0; j--) {
              if (mongodocs[j].yelp_id == data.businesses[i].id) { // if the mongodoc.yelp_id == yelp_api.id
                data.businesses[i].user_names = mongodocs[j].user_names; // add the user_names array to the yelp_api document (this will be used to calc # RSVP'd)
                mongodocs.splice(j, 1); // once matched, splice that record for efficiency
                break;
              }
            }
          }
          res.send({ data: data.businesses });
        })
      })
      .catch(err => console.log(err));
    }

    // res.send({ data: data.businesses });
  });

  app.route('/auth/twitter/reverse')
    .post((req, res) => {
      request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: "http://easy-stitch.glitch.me/auth/twitter", // /callback
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET
        }
      }, (err, r, body) => {
        if (err) { return res.send(500, { message: err.message }); }

        let jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      });
  });


  app.route('/auth/twitter')
    .post((req, res, next) => {
      request.post({
        url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
        oauth: {
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, (err, r, body) => {
        if (err) { return res.send(500, { message: err.message }); }

        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        next();
      });
    }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
        if (!req.user) {
          return res.send(401, 'User Not Authenticated');
        }

        // prepare token for API
        req.auth = {
          id: req.user.id
        };

        return next();
  }, generateToken, sendToken);


  app.route('/rsvp')
  .post((req, res) => {
    let yelp_id = req.query.yelp_id;
    let user_id = req.query.user_id;
    let user_name = req.query.user_name;
    
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    
    let tomorrow = new Date(year, month, day, 6);
    tomorrow.setDate(today.getDate()+1); // sets date for 6 a.m. tomorrow
    
    let obj = { }; // add expiresAt: tomorrow, plus other data

    let data;

    db.collection('bars').update({ yelp_id },
    {
      $addToSet: { user_ids: user_id, user_names: user_name },
      $set: { expireAt: new Date('August 9, 2018 22:47:00'), createdAt: new Date() }
    }, { upsert: true }, (err, doc) => {
      if (err) { console.log("err : ", err); }
      else {
        // res.send({ data: data.businesses });
      }
    });
    res.send({ data: "good" });
  });
  
  app.route('/unrsvp')
  .post((req, res) => {
    let yelp_id = req.query.yelp_id;
    let user_id = req.query.user_id;
    let user_name = req.query.user_name;
    let data;

    db.collection('bars').update({ yelp_id }, { $pull: { user_ids: user_id, user_names: user_name } }, (err, doc) => {
      if (err) { console.log(err); }
      else {
        // console.log("undoc : ", doc);
        // res.send({ data: data.businesses });
      }
    });
    res.send({ data: "good" });
  });





});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
