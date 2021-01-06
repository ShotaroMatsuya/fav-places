const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = require('../secret');

async function getCoordsForAddress(address) {
  //api-keyを使わない場合のダミー
  //   return {
  //     lat: 35.685175,
  //     lng: 139.7527995,
  //   };

  //encodeURIComponentメソッドはjavascriptのobjectをURL friendly format にencodeしてくれるbuiltinFunction
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;
  if (!data || data.status === 'ZERO_RESULTS') {
    //addressを特定できなかった場合
    const error = new HttpError(
      'Could not find location fo the specified address.',
      422
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
