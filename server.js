'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var Q = require('q');

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/dist', express.static(__dirname + '/dist'));


app.get('/', function(req, res) {
		res.sendfile('./index.html');
});

app.get('/test', function(req, res){
	var deferred = Q.defer();
	fs.readFile("gulpfile.js", "utf-8", function (error, text) {
		if (error) {
			deferred.reject(new Error(error));
		} else {
			res.send(text);
			deferred.resolve(text);
		}
	});
	return deferred.promise;
});

app.listen(5000);