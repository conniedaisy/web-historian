var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.url === '/' && req.method === 'GET') {
    var fileName = path.join(__dirname, 'public/index.html');
    var readStream = fs.createReadStream(fileName);
    readStream.pipe(res);
  } else {
    res.end(archive.paths.list);
  }
};
