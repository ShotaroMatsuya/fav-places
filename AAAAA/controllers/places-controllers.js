const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });
  if (!place) {
    //synchronous code でerrorを投げるにはthrow()、asynchronous codeではnext()
    throw new HttpError('Could not find a place for the provided id.', 404);
  }
  res.json({ place }); // meant by modern js syntax => {place} => {place:place}
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a places for the provided user id.', 404)
    );
  }
  res.json({ places });
};
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(), //uuidパッケージよりインストール、uniqueなidを自動生成する
    title, //{title:title}のショートハンド
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)だと先頭に追加
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  //まずはimmutableにobjectやarrayを操作(cloneを作成)してから最後に上書きするのがbest practice
  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }; //spread-operatorでcloneを作成
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
