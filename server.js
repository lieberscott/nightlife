const bodyparser = require('body-parser');
const express = require('express');
const expressJwt = require('express-jwt');
const app = express();
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
  return res.status(200).send(JSON.stringify(req.user));
};

//token handling middleware
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

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/app/index.html');
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


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
