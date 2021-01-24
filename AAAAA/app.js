const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const { DATABASE_PASSWORD } = require('./secret');
const url = `mongodb+srv://shotaro:${DATABASE_PASSWORD}@cluster0.omrq7.mongodb.net/mern?retryWrites=true&w=majority`;

const app = express();

//post-requestを受け取るときに必要
//jsonメソッドを使うと、reqに含まれるjsonファイルをjavascriptのobjectやarrayに変形してくれる
app.use(bodyParser.json());

// to prevent cors error(cross origin resource sharing) ,attached certain headers to the response
// CORSはgeneral security concept ではなくブラウザによるrestrictであるためpost manでは普通にアクセスできる
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //whichever domains should access
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next();
});

app.use('/api/places', placesRoutes); //routeオブジェクトはexpressにより自動的にmiddlewareとして扱われる(nextいらない)
app.use('/api/users', usersRoutes);
//router middlewareのあとに404エラー用middlewareを作成
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error; //synchronousなのでthrow
});

//error handling middleware...4つのparameterをセットするとexpressにより自動的にerror middlewareと認識される
app.use((error, req, res, next) => {
  if (res.headerSent) {
    //headerがすでに送られていた場合にtrueになる(total 1回だけしかheaderは送ることができない)
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(url)
  .then(() => {
    app.listen(5000, () => {
      console.log('App listening on port 5000!');
    });
  })
  .catch(err => {
    console.log(err);
  });
