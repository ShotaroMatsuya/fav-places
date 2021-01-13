const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Station of Tokyo',
    description:
      'A mecca of Japanese history and business. You can taste most of modern Japanese culture there!',
    location: {
      lat: 35.6812362,
      lng: 139.7649361,
    },
    address: '〒100-0005 東京都千代田区丸の内１丁目',
    creator: 'u1',
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  //findByIdはreal promiseオブジェクトを返さないが、thenやcatchでつなげることができる
  // exec()することでreal promiseオブジェクトに変換可能
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }
  if (!place) {
    //synchronous code でerrorを投げるにはthrow()、asynchronous codeではnext()
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }
  // 1.mongooseから引っ張ってきたdocumentをjavascriptで取り扱えるようにする
  // 2.mongooseの_idというキーをidというキーに変換する({getters:true}によりstringで帰ってくるidをobjectのpropertyにしてくれる)
  // Getters let you transform data in MongoDB into a more user friendly form
  res.json({ place: place.toObject({ getters: true }) }); //_id -> id
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  //基本的にはfindByIdと同じ、findの中にオブジェクトをセットすると条件とマッチする全てのplacesを返す
  // mongoDBのfindはcursorオブジェクトを返すが、mongooseの場合はarrayを返す
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed,please try again later',
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a places for the provided user id.', 404)
    );
  }
  //findメソッドで帰ってくるのはarrayなので,そのままではtoObjectメソッドは使えない.
  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};
const createPlace = async (req, res, next) => {
  const errors = validationResult(req); //reqオブジェクトに含まれるバリデーションエラー(obj)を取得
  if (!errors.isEmpty()) {
    // throw new HttpError('Invalid inputs passed,please check your data.', 422);
    // async code内でエラーを投げる場合はnext()を用いること
    return next(
      new HttpError('Invalid inputs passed,please check your data.', 422)
    );
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://media.timeout.com/images/105544832/1372/772/image.jpg',
    creator,
  });

  // DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)だと先頭に追加
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req); //reqオブジェクトに含まれるバリデーションエラー(obj)を取得
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed,please check your data.', 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  // //まずはimmutableにobjectやarrayを操作(cloneを作成)してから最後に上書きするのがbest practice
  // const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }; //spread-operatorでcloneを作成
  // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong , could not update place',
      500
    );
    return next(error);
  }

  // DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: place.toObject({ getters: true }) });
};
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
