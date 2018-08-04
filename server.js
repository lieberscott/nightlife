import config from './config';
import apiRouter from './api';
import express from 'express';

const app = express();

app.use(express.static('public'));
// app.use('/api', apiRouter);
app.set('view engine', 'pug');

app.listen(config.port, () => {
  console.log("Express listening on port " + config.port);
});

app.get('/', (req, res) => {
  res.render(process.cwd() + '/views/public/index');
});

// app.get("/about", (req, res) => {
//   res.send("The about page");
// })
