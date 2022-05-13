const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(err);
  }

  const createdUser = new User({
    name,
    email,
    // image: req.file.path,
    image: req.file.key,
    password: hashedPassword,
    places: [],
  });

  // DUMMY_USERS.push(createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing Up failed, please try again.', 500);
    return next(error);
  }
  //generate json-web-token
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed,please try again later.',
      500
    );
    return next(error);
  }
  // mongooseオブジェクトをjavascriptオブジェクトにconvert
  // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403 // be forbidden or not authenticated error
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials,could not log you in.',
      403
    );
    return next(error);
  }
  //generate json-web-token
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed,please try again later.',
      500
    );
    return next(error);
  }
  res.json({
    // message: 'Logged in!',
    // // mongooseオブジェクトをjavascriptオブジェクトにconvert
    // user: existingUser.toObject({ getters: true }),
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
