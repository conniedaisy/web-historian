// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('/Users/student/Documents/2016-02-web-historian/helpers/archive-helpers');
var Promise = require('bluebird');

archive.readListOfUrls().then(archive.downloadUrls);

setTimeout(function() {},10000);