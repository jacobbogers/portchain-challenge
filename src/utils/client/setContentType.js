function setContentType(headers, value = 'application/json') {
  const contentTypeKey = Object.keys(headers).find((key) => key.toLowerCase() === 'content-type');
  if (contentTypeKey) {
    delete headers[contentTypeKey];
  }
  // eslint-disable-next-line no-param-reassign
  headers['Content-Type'] = value;
  return headers;
}

module.exports = setContentType;
