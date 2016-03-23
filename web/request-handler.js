var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var headers = require('./http-helpers.js').headers;
// require more modules/folders here!

var readPost = function(req, res, cb) {
  var body = '';
  console.log('receiving post');
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    cb(body);
  });
};

exports.handleRequest = function (req, res) {
  if (req.url === '/' && req.method === 'GET') {
    console.log('getting index');
    var fileName = path.join(__dirname, 'public/index.html');
    var readStream = fs.createReadStream(fileName);
    readStream.pipe(res);
  } else if (req.url === '/' && req.method === 'POST') {
    console.log('something is here!');
    res.writeHead(302, headers);
    readPost(req, res, function(message) {
      var url = message.split('=')[1];
      fs.appendFileSync(archive.paths.list, url + '\n');
    });
    res.end('in process');
  } else {
    res.end(archive.paths.list);
  }
};
