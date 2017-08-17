var express = require('express');
var router = express.Router();

var configFile = null;
try {
  configFile = require('../config-file')
} catch (e) {
  console.error('unable to find or parse ../config-file')
  configFile = {};
}

var configDirFile1 = null;
try {
  configDirFile1 = require('../config-dir/config-dir-file-1');
} catch (e) {
  console.error('unable to find or parse ../config-dir/config-dir-file-1')
  configDirFile1 = {};
}

var configDirFile2 = null;
try {
  configDirFile2 = require('../config-dir/config-dir-file-2');
} catch (e) {
  console.error('unable to find or parse ../config-dir/config-dir-file-2')
  configDirFile2 = {}
}

console.log('cff',configFile);
console.log('cdf1',configDirFile1);
console.log('cdf2',configDirFile2);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{"cff":configFile,"cdf1":configDirFile1,"cdf2":configDirFile2});
});

module.exports = router;
