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
		var promise = Q.ninvoke(fs, 'readFile', 'gulpfile.js', 'utf-8');
		promise.then(function (text) {
				res.status(200).send(text);
		}, function(err) {
				console.error(err);
				res.status(500).send(err);
		});
});

app.listen(5000);