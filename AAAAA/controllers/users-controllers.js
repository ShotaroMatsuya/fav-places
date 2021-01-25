const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    // const users = User.find({}, 'email name'); //全Userからemailとnameフィールドのみを取得
    users = await User.find({}, '-password'); //全Userからpassword以外のフィールドのみを取得(自動的にarray)
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed , please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req); //reqオブジェクトに含まれるバリデーションエラー(obj)を取得
  if (!errors.isEmpty()) {
    // throw new HttpError('Invalid inputs passed,please check your data.', 422);
    //asynchronous task内ではthrowでなくnextを使うこと
    return next(
      new HttpError('Invalid inputs passed,please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;

  // const hasUser = DUMMY_USERS.find(u => u.email === email);
  // if (hasUser) {
  //   throw new HttpError('Could not create user, email already exists.', 422);
  // }
  let existingUser;
  try {
    //findOneメソッドは文字通り一つの結果だけ返す
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed , please try again later.',
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg',
    password,
    places: [],
  });

  // DUMMY_USERS.push(createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing Up failed, please try again.', 500);
    return next(error);
  }
  // mongooseオブジェクトをjavascriptオブジェクトにconvert
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError(
  //     'Could not identify user, credentials seem to be wrong.',
  //     401
  //   );
  // }
  let existingUser;
  try {
    //findOneメソッドは文字通り一つの結果だけ返す
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed , please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    // mongooseオブジェクトをjavascriptオブジェクトにconvert
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
