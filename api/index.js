import express from 'express';
// import fetch from 'node-fetch';

const router = express.Router();

router.get('/', async (req, res) => {

  let data;

  await fetch('https://api.yelp.com/v3/businesses/search?categories=nightlife&limit=50&location=boston,ma', {
      headers: {
        Authorization: 'Bearer ' + qA7HT7MdkEXIuUnxbzl7AhY2Wl_pRGqnf7dLeTmArzHqobM9moT9GvZWfOUDCnWjG480pQqJL21Ttd3_KAdQ_xfnq5hbvKGzZX09ZMAPauDg10T_AKf5S8f4SBxjW3Yx
      }
    })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      return;
    })
    .catch(err => console.log(err));




  res.send({ data: data.businesses[0] });
})

export default router;
