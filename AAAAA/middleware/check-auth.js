const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  // tokenはurlクエリパラメータから取得する方法もある(今回はauthorization headersから取得)
  try {
    const token = req.headers.authorization.split(' ')[1]; //Authorization: 'Bearer Token'
    if (!token) {
      throw new Error('Authentication failed!', 401);
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    // we are able to use this user data object which is part of the every request
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
};
