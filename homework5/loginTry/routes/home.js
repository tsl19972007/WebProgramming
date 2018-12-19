var express=require('express');
var router = express.Router();
var login=require('./login.js');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User_picture=require('../model/user_picture');
var User_imageBox=require('../model/user_imageBox');

router.get('/',function(req, res) {
    if (!req.session.logged_in) {
        login.Notlogin(req, res);
    } else {
        login.loggedIn(req, res);
    }
});

router.get('/showPictures',function(req,res){
    console.log("show");
    var html_pictures="";
    var userToFind={
        username:req.session.username
    };
    User_picture.find(userToFind,function (err, user_picture) {
        for(var i=0;i<user_picture.length;i++){
            var remark=user_picture[i].remark;
            var path="upload/"+user_picture[i].username+"/"+user_picture[i].picture;
            html_pictures+='<div class="img"> <a target="_blank" href='
                + path + '>' + '<img src=' + path + '>' +
                '</a>\n' + '<div class="desc">'+ remark +'</div> </div>'

        }
        res.json({"html_pictures":html_pictures});
    });
});

router.get('/showImageBoxes',function(req,res){
    console.log("show");
    var html_imageBoxes="";
    var userToFind={
        username:req.session.username
    };
    User_imageBox.find(userToFind,function (err, user_imageBox) {
        for(var i=0;i<user_imageBox.length;i++){
            var title=user_imageBox[i].title;
            var cover=user_imageBox[i].pictures[0];
            cover="box-big-"+cover;
            var src="upload/"+user_imageBox[i].username+"/"+cover;
            var target="imageBox?id="+user_imageBox[i].boxID;
            html_imageBoxes+='<div class="img"> <a target="_blank" href='
                + target + '>' + '<img src=' + src + '>' +
                '</a>\n' + '<div class="desc">'+ title +'</div> </div>'
        }
        res.json({"html_imageBoxes":html_imageBoxes});
    });
});


module.exports = router;