
const Raven = require('raven');
const RavenLambdaWrapper = require('serverless-sentry-lib');

const optimizer = require('./resize');
const responder = require('./responder');
const ParamBuilder = require('./param_builder');

const logger = require('../lib/logger');

const ravenConfig = {
  captureTimeoutWarnings: false,
  ravenClient: Raven,
};

exports.main = RavenLambdaWrapper.handler(ravenConfig, (event, context, callback) => {
  const path = event.path.substr(1);
  if (path === 'favicon.ico') {
    return callback(null, responder.BadRequest('favicon.ico'));
  }

  try {
    logger.info('function start');
    const params = ParamBuilder.buildParams(path);
    return optimizer.optimize(params, (err, contentType, imageBuffer) => {
      if (err) {
        throw err;
      }

      logger.info('function end');
      return callback(null, responder.Success(imageBuffer, contentType));
    });
  } catch (e) {
    return callback(e);
  }
});

