
const gm = require('gm').subClass({ imageMagick: true });
const async = require('async');
const AWS = require('aws-sdk');
const config = require('../lib/config');

const logger = require('../lib/logger');

const S3 = new AWS.S3();

const { BUCKET_NAME, FILE_CACHE_AGE } = config;

// Download the image from S3 into a buffer.
function download(params, next) {
  logger.info('start download file from s3');
  S3.getObject({
    Bucket: BUCKET_NAME,
    Key: params.originalDir,
  }, next);
}

function resize(params, response, next) {
  logger.info('start resize file');
  // Setting
  // https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick
  gm(response.Body)
    .resize(params.width, params.height)
    .filter('Triangle')
    .define('filter:support=2')
    .unsharp(0.25, 0.08, 8.3, 0.045)
    .dither(false)
    .quality(params.quality)
    .define('jpeg:fancy-upsampling=off')
    .define('png:compression-filter=5')
    .define('png:compression-level=9')
    .define('png:compression-strategy=1')
    .define('png:exclude-chunk=all')
    .interlace('None')
    .strip()
    .toBuffer(params.imageType, (err, buffer) => {
      if (err) {
        next(err);
      } else {
        next(null, response.ContentType, buffer);
      }
    });
}


function upload(params, contentType, imageBuffer, next) {
  logger.info('start upload file');
  S3.putObject({
    Bucket: BUCKET_NAME,
    Key: params.cachedDir,
    Body: imageBuffer,
    ContentType: contentType,
    ACL: 'public-read',
    CacheControl: `max-age=${FILE_CACHE_AGE}`,
    Metadata: {
      CacheControl: `max-age=${FILE_CACHE_AGE}`,
    },
  }, (err) => {
    if (err) {
      next(err);
    } else {
      next(null, contentType, imageBuffer);
    }
  });
}


function optimize(params, callback) {
  logger.info('optimize start');
  S3.headObject({
    Bucket: BUCKET_NAME,
    Key: params.originalDir,
  }, (err) => {
    if (err) {
      callback(err);
    }
    logger.info('check exist file in s3');
    async.waterfall([
      async.apply(download, params),
      async.apply(resize, params),
      async.apply(upload, params),
    ], (wfErr, contentType, imageBuffer) => {
      if (wfErr) {
        callback(wfErr);
      }
      logger.info('optimize end');
      callback(null, contentType, imageBuffer);
    });
  });
}


module.exports = {
  optimize,
};

