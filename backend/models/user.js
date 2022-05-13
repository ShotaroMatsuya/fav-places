const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, //uniqueを使うには3rd party package(mongoose-unique-validator)必要
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },

  // one User hasMany places ->add array
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
});

//we can query our email as fast as possible in our database with unique.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
