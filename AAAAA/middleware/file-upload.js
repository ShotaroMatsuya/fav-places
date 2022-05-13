const multer = require('multer');
require('dotenv').config();

const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

// const fileUpload = multer({
//   limits: 50000,
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/images');
//     },
//     filename: (req, file, cb) => {
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, uuidv4() + '.' + ext);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     //   !!をつけるとundefined と null をfalseにconvertしてくれる
//     const isValid = !!MIME_TYPE_MAP[file.mimetype];
//     let error = isValid ? null : new Error('Invalid mime type !');
//     cb(error, isValid);
//   },
// });

//init s3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
//s3 config
const fileStorage = multerS3({
  s3: s3,
  bucket: process.env.MY_BUCKET,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const ext = MIME_TYPE_MAP[file.mimetype];
    const filePath = `uploads/images/${uuidv4()}.${ext}`;
    cb(null, filePath);
  },
});
const fileFilter = (req, file, cb) => {
  //   !!をつけるとundefined と null をfalseにconvertしてくれる
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  let error = isValid ? null : new Error('Invalid mime type !');
  cb(error, isValid);
};
const fileUpload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

module.exports = fileUpload;
