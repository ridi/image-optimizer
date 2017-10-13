
const defaultHeaders = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};


function makeHeaders(headers) {
  return Object.assign({}, defaultHeaders, headers);
}

module.exports = {
  Success: (imageBuffer, imageType) => ({
    statusCode: 200,
    headers: makeHeaders({
      Accept: imageType,
      'Content-Type': imageType,
    }),
    body: imageBuffer.toString('base64'),
    isBase64Encoded: 'True',
  }),
  Redirect: (body, location) => ({
    statusCode: 301,
    headers: makeHeaders({
      location,
    }),
    body: JSON.stringify(body),
  }),
  BadRequest: msg => ({
    statusCode: 400,
    headers: defaultHeaders,
    body: JSON.stringify({
      statusCode: 400,
      error: 'Bad Request',
      message: msg,
    }),
  }),
  NotFound: msg => ({
    statusCode: 404,
    headers: defaultHeaders,
    body: JSON.stringify({
      statusCode: 404,
      error: 'Image Not Found',
      message: msg,
    }),
  }),
  InternalServerError: msg => ({
    statusCode: 500,
    headers: defaultHeaders,
    body: JSON.stringify({
      statusCode: 500,
      error: 'Internal Server Error',
      internalError: JSON.stringify(msg),
    }),
  }),
};

