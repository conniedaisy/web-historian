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

var renderPage = function(url, res) {
  var filePath = archive.paths.archivedSites + '/' + url;
  res.writeHead(200);
  var readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
};

exports.handleRequest = function (req, res) {
  if (req.url === '/' && req.method === 'GET') {
    var fileName = path.join(__dirname, 'public/index.html');
    var readStream = fs.createReadStream(fileName);
    readStream.pipe(res);
  } else if (req.url === '/' && req.method === 'POST') {
    readPost(req, res, function(message) {
      var url = message.split('=')[1];
      fs.exists(archive.paths.archivedSites + '/' + url, function(exists) {
        console.log(exists);
        if (exists) {
          renderPage(url, res);
        } else {
          res.writeHead(302, headers);
          fs.appendFileSync(archive.paths.list, url + '\n');
          var loadingPath = archive.paths.siteAssets + '/' + 'loading.html';
          var readLoadingStream = fs.createReadStream(loadingPath);
          readLoadingStream.pipe(res);
        }
      });
    });
  } else if (req.method === 'GET') {
    var url = req.url.slice(1);
    archive.isUrlArchived(url, function(exists) {
      if (exists) {
        renderPage(url, res);
      } else {
        res.writeHead(404, headers);
        res.end('file not found');
      }
    });  
  } 
};

