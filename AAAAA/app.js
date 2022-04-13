const fs = require('fs');
const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const fileHelper = require('./middleware/file-delete');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.omrq7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

//post-requestを受け取るときに必要
//jsonメソッドを使うと、reqに含まれるjsonファイルをjavascriptのobjectやarrayに変形してくれる
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

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
  if (req.file) {
    //fileがstorageされたあとにerrが発生したらfileを削除する
    // fs.unlink(req.file.path, err => {
    //   console.log(err);
    // });
    fileHelper.deleteFile(req.file.key);
  }
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
    app.listen(process.env.PORT || 5000, () => {
      console.log('App listening on port 5000!');
    });
  })
  .catch(err => {
    console.log(err);
  });
