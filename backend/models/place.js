const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  // ref property allows us to establish a connection between our current User Schema
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

// model method is provided by mongoose .
// 1st arg => name of model (Convention: uppercase starting character & singular form)
// 2nd arg =>Schema
module.exports = mongoose.model('Place', placeSchema);
