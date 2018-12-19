var express=require('express');
var router = express.Router();
var login=require('./login.js');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User_picture=require('../model/user_picture');

router.get('/',function(req, res) {
    if (!req.session.logged_in) {
        login.Notlogin(req, res);
    } else {
        res.render('search.ejs', {
            title:"Search",
        });
    }
});

router.get('/getHotTags',function(req, res) {
    var tagLikes;
    var tagNum;
    User_picture.find({},function (err, user_picture) {
        var newArr = [];
        for (var i = 0; i < user_picture.length; i++) {
            for (var j = 0; j < user_picture[i].labels.length; j++)
                if (newArr.indexOf(user_picture[i].labels[j]) == -1) {
                    newArr.push(user_picture[i].labels[j])
                }
        }
        console.log(newArr.length);
        var newarr2 = new Array(newArr.length);
        for (var i = 0; i < newarr2.length; i++) {
            newarr2[i] = 0;
        }
        for (var i = 0; i < newArr.length; i++) {
            for (var j = 0; j < user_picture.length; j++) {
                for (var k = 0; k < user_picture[j].labels.length; k++) {
                    if (newArr[i] == user_picture[j].labels[k]) {
                        newarr2[i] += user_picture[j].likes;
                    }
                }
            }
        }
        for (var m = 0; m < newArr.length; m++) {
            console.log(newArr[m] + "likes为：" + newarr2[m]);
        }
        for (var i = 0; i < newArr.length - 1; i++)
            for (var j = 0; j < newArr.length - 1 - i; j++)
                if (newarr2[j] < newarr2[j + 1]) {
                    var temp = newarr2[j];
                    newarr2[j] = newarr2[j + 1];
                    newarr2[j + 1] = temp;
                    var temp2 = newArr[j];
                    newArr[j] = newArr[j + 1];
                    newArr[j + 1] = temp2;
                }
        var result=newArr.slice(0,5);
        for (var m = 0; m < result.length; m++) {
            console.log(result[m]);
        }
        res.json({"hotTags":result});
    });
});
module.exports = router;