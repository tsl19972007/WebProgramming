var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var mongoose=require('mongoose');
var User = require('../model/user');
var router = express.Router();

app.set('views', __dirname +'/../view');
app.set('view engine', 'ejs');

// 定义局部变量
var jsonArray = [];
var numOfJson = 0;
var errorInfo = "";
var usernameInRequest;

app.use(express.static(__dirname + '/public'));
router.get('/logout', function(req, res) {
    req.session.logged_in = 0;
    res.redirect('/');
});
router.get('/info',function(req, res) {
    if (!req.session.logged_in) {
        Notlogin(req, res);
    } else {
        loggedIn(req, res);
    }
});
router.get('/',function(req, res) {
	if (!req.session.logged_in) {
		Notlogin(req, res)
	} else {
		loggedIn(req, res)
	}
});
router.post('/signin', urlencodedParser, function (req, res) {
	console.log("check password");
	var testuser = {
		username:req.body.username_signin,
		password:req.body.password_signin,
	};
	var d = getMD5Password(testuser.password);
  	console.log("加密的结果：(验证)"+d);
	testuser.password = d;
	User.find(testuser, function (err, detail) {
		if (detail.length) {
			console.log("loggedIn!");
			signinCheckSuccess(detail, req, res)
		} else {
			console.log("wrong!");
            errorInfo = "用户名不存在或密码错误";
            res.render('signin.ejs',{
                errorInfo:errorInfo
            })
		}
	})
});
router.post('/signup', urlencodedParser, function(req, res) {
	console.log("Data from submit form");
	var user = new User({
		username:req.body.username_signup,
		password:req.body.password_signup,
	});
	var d = getMD5Password(user.password);
	console.log("加密的结果："+d);
	user.password = d;
	console.log(user);
	var flag = {one:1,two:1,three:1,four:1};
	checkDataRep(user, flag, req, res);
});
function dealWithDataSubmited (user, flag, req, res) {
	console.log(flag);
	if (!(flag.one&&flag.two&&flag.three&&flag.four)) {
		repreload(res);
	} else {
		user.save(function(err) {
			if (err) {
				console.log('保存失败');
				return;
			}
			console.log('保存成功');
		});
		console.log(user.username + " has been added");
        res.redirect('/');
	}
}
function findJson(name, res) {
	var testUsername = {username:name};
	User.find(testUsername,function (err, userDetail) {
		if (userDetail.length == 0) {
			console.log(userDetail);
			res.render('index.ejs', {
				errorInfo:'请输入信息'
			});

		} else {
			console.log(userDetail);
			console.log("Load user: " + name);
			console.log(userDetail[0]);
			showInfo(userDetail[0], res);
		}
	})
}
function Notlogin(req, res) {
	if (req.param("username") == undefined) {
		console.log("initial page");
		res.render('signin.ejs', {
			errorInfo:'请输入信息'
		})
	} else {
		var username = req.param("username").toString();
		console.log("find user: " +  username);
		findJson(username, res)
	}
}
function loggedIn(req, res) {
	if (req.param("username") == undefined) {
		findJson(req.session.username, res);
	} else {
		var username = req.param("username").toString();
		console.log(username);
		if (username != req.session.username) {
			console.log("1");
			var testUsername = {username:req.session.username};
			User.find(testUsername,function (err, userDetail) {
				infoPage(res, userDetail, "只能显示已登录用户")
			})
		} else {
            console.log("2");
			var testUsername = {username:req.session.username};
			User.find(testUsername,function (err, userDetail) {
				infoPage(res, userDetail, "用户详情")
			})
		}
	}
}
function getMD5Password(content) {
  	var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
  	md5.update(content);
  	var d = md5.digest('hex');  //加密后的值d
	return d;
}
function signinCheckSuccess(detail, req, res) {
	var userInDatabase = {
		username:detail[0].username,
	};
	console.log("user in database :");
	console.log(userInDatabase);
	req.session.logged_in = 1;
	req.session.username = req.body.username_signin;
    res.redirect('/info');
}
function infoPage(res, userDetail, errorInfoDetail) {
	res.render('homepage.ejs', {
		username:userDetail[0].username
	})
}
function showInfo(user, res) {
	res.render('homepage.ejs', {
		username:user.username
	});
}
function checkDataRep(user, flag, req, res) {
	var testUsername = {username:user.username};
	console.log("check");
	User.find(testUsername, function (err, detail) {
		console.log(detail);
		if (detail.length) {
			console.log("重复");
			flag.one = 0;
			errorInfo = errorInfo + "用户名重复\n";
		}
        dealWithDataSubmited(user, flag, req, res);
	});
}
function repreload(res) {
	res.render('signin.ejs',{
		errorInfo:errorInfo
	})
}
module.exports = router;
