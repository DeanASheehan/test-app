var express  = require('express');
var app      = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var http = require('http');
var request = require('request');
var fs = require('fs');
var config = require('./config');

if (fs.existsSync('.env')) {
    dotenv.load();
}

var configFile = null;
try {
  configFile = require('./config-file')
} catch (e) {
  console.error('unable to find or parse ./config-file')
  configFile = {};
}

var configDirFile1 = null;
try {
  configDirFile1 = require('./config-dir/config-dir-file-1');
} catch (e) {
  console.error('unable to find or parse ./config-dir/config-dir-file-1')
  configDirFile1 = {};
}

var configDirFile2 = null;
try {
  configDirFile2 = require('./config-dir/config-dir-file-2');
} catch (e) {
  console.error('unable to find or parse ./config-dir/config-dir-file-2')
  configDirFile2 = {}
}

app.use('/',express.static(__dirname + '/'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.use('/version', function(req, res, next) {
  res.json({version:process.env.VERSION});
});

app.use('/data', function(req, res, next) {
    res.json([
        {label:"Pipeline", value: configFile ? configFile.value : 'N/A'},
        {label:"Stage", value:configDirFile1 ? configDirFile1.value : 'N/A'},
        {label:"Namespace", value:configDirFile2 ? configDirFile2.value : 'N/A'},
        {label:"Version", value:configDirFile1 ? configDirFile1.version : 'N/A'},
        {label:"Sensitive", value:configDirFile1 ? configDirFile1.sensitive : 'N/A'}
    ]);
  });
  

var port = process.env.PORT;
var server = app.listen(port, function() {
    console.log('listening on port ', port);
});

