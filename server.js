import config from './config';
// import apiRouter from './api';
import express from 'express';
import fetch from 'node-fetch';
// import sassMiddleware from 'node-sass-middleware';
// import path from 'path';

const app = express();

app.use(express.static('public'));
// app.use('/api', apiRouter);

// app.use(sassMiddleware({ // not using SASS because it wasn't working with Bootstrap/React Components
//   src: path.join(__dirname, 'sass'),
//   dest: path.join(__dirname, 'public')
// }));

app.set('view engine', 'pug');

app.listen(config.port, () => {
  console.log("Express listening on port " + config.port);
});

app.get('/', async (req, res) => {
  res.render(process.cwd() + '/views/public/index');
});

app.get("/api", async (req, res) => {
  let data;

  await fetch('https://api.yelp.com/v3/businesses/search?categories=nightlife&limit=50&location=boston,ma', {
      headers: {
        Authorization: 'Bearer ' + "qA7HT7MdkEXIuUnxbzl7AhY2Wl_pRGqnf7dLeTmArzHqobM9moT9GvZWfOUDCnWjG480pQqJL21Ttd3_KAdQ_xfnq5hbvKGzZX09ZMAPauDg10T_AKf5S8f4SBxjW3Yx"
      }
    })
    .then((res) => res.json())
    .then((json) => {
      data = json;
      return;
    })
    .catch(err => console.log(err));

  res.send({ data: data.businesses });
})
