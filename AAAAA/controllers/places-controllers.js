const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
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

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId;
  });
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }
  res.json({ place });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
