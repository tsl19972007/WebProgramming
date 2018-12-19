var express=require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User_picture=require('../model/user_picture');
var User_imageBox=require('../model/user_imageBox');

router.post('/picture',urlencodedParser, function(req, res){
    var wherestr = {'picture' : req.body.pictureId};
    var updatestr = {$inc:{'likes':1}};

    User_picture.updateOne(wherestr, updatestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("图片点赞更新成功");
        }
    })
});

router.post('/imageBox',urlencodedParser, function(req, res){
    var wherestr = {'boxID' : req.body.boxId};
    console.log(req.body.boxId);
    var updatestr = {$inc:{'likes':1}};

    User_imageBox.updateOne(wherestr, updatestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("imageBox点赞更新成功");
        }
    })
});

module.exports = router;