var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var headers = require('./http-helpers.js').headers;
// require more modules/folders here!

var readPost = function(req, res, cb) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    cb(body);
  });
};

exports.handleRequest = function (req, res) {
  if (req.url === '/' && req.method === 'GET') {
    console.log('test');
    var fileName = path.join(__dirname, 'public/index.html');
    var readStream = fs.createReadStream(fileName);
    readStream.pipe(res);
  } else if (req.url === '/' && req.method === 'POST') {
    res.writeHead(302, headers);
    readPost(req, res, function(message) {
      var url = message.split('=')[1];
      fs.appendFileSync(archive.paths.list, url + '\n');
    });
    res.end('in process');
  } else if (req.method === 'GET') {
    var url = req.url.slice(1);
    var filePath = archive.paths.archivedSites + '/' + url;

    console.log(filePath);
    // check if exits
    fs.exists(filePath, function(exists) {
      if (exists) {
        res.writeHead(200);
        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      } else {
        res.writeHead(404, headers);
        res.end('file not found');
      }
    });   
  } else {
    res.end(archive.paths.list);
  }
};
