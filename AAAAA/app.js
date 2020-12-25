const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use('/api/places', placesRoutes); //routeオブジェクトはexpressにより自動的にmiddlewareとして扱われる(nextいらない)

//error handling middleware...4つのparameterをセットするとexpressにより自動的にerror middlewareと認識される
app.use((error, req, res, next) => {
  if (res.headerSent) {
    //headerがすでに送られていた場合にtrueになる(total 1回だけしかheaderは送ることができない)
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(5000, () => {
  console.log('App listening on port 5000!');
});
