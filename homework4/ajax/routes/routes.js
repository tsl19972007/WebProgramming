var express = require('express');
var routes = require('./server');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });



module.exports = function(app) {
	// 设置页面的跳转还有session的设置
    app.use(bodyParser({limit: '50mb'}));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
	app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
	app.use('/',routes);
    app.use('/info',routes);
    app.use('/signup',routes);
    app.use('/signin',routes);
    app.use('/logout',routes);
    app.use('/upload',routes);
    app.use('/upload_s',routes);
    app.use('/imageBox',routes);
	app.use('/showPictures',routes);
	app.use(express.static(__dirname + '/public'));
};
