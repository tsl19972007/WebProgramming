var express = require('express');
var home=require('./home.js');
var upload=require('./upload.js');
var upload_s=require('./upload_s.js');
var imageBox=require('./imageBox.js');
var login=require('./login.js');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = function(app) {
	// 设置页面的跳转还有session的设置
    app.use(bodyParser({limit: '50mb'}));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    // session时限为5分钟
	app.use(session({ secret: 'keyboard cat', cookie: { httpOnly: true, maxAge: 300000 }}));
    app.use('/home',home);
    app.use('/upload',upload);
    app.use('/upload_s',upload_s);
    app.use('/imageBox',imageBox);
    app.use('/',login);
	app.use(express.static(__dirname + '/public'));
};
