module.exports = function writeToStreamAndEnd(writable, data) {
  return new Promise((resolve) => {
    writable.on('error', (err) => {
      resolve([err]);
    });
    writable.on('abort', (err) => {
      resolve([`connection aborted with argument:[${String(err)}]`]);
    });
    writable.on('close', (err) => {
      resolve([`connection closed with error:[${String(err)}]`]);
    });
    writable.end(data, 'utf8', () => {
      resolve([undefined, true]);
    });
  });
};
