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
            var remark = "<ul class=\"tags-list\">\n";
            var likes=user_picture[i].likes;
            var html_like="  <li class=\"tag_like\"><p class=\"like\">❤<span class=\"likes\">"+likes+"</span>\n" +
                "                                <span class=\"picture_id\" style=\"display:none\">"+user_picture[i].picture+"</span>\n" +
                "                            <span class=\"pori\" style=\"display:none\">p</span></p>\n" +
                "                        </li>";
            remark+=html_like;
            for(var j=0;j<user_picture[i].labels.length;j++) {
                var target="/label_picture?label="+user_picture[i].labels[j];
                remark += "<li class=\"tag\">"+"<a href="+target+">"+user_picture[i].labels[j]+"</a></li>\n" ;
            }
            remark += "</ul>";
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
            var remark = "<ul class=\"tags-list\">\n";
            var likes=user_imageBox[i].likes;
            var html_like="  <li class=\"tag_like\"><p class=\"like\">❤<span class=\"likes\">"+likes+"</span>\n" +
                "                                <span class=\"picture_id\" style=\"display:none\">"+user_imageBox[i].boxID+"</span>\n" +
                "                            <span class=\"pori\" style=\"display:none\">i</span></p>\n" +
                "                        </li>";
            remark+=html_like;
            for(var j=0;j<user_imageBox[i].labels.length;j++) {
                var target="/label_imageBox?label="+user_imageBox[i].labels[j];
                remark += "<li class=\"tag\">"+"<a href="+target+">"+user_imageBox[i].labels[j]+"</a></li>\n" ;
            }
            remark += "</ul>";
            var target="imageBox?id="+user_imageBox[i].boxID;
            html_imageBoxes+='<div class="img"> <a target="_blank" href='
                + target + '>' + '<img src=' + src + '>' +
                '</a>\n' + '<div class="desc">'+ remark +'</div> </div>';

        }
        res.json({"html_imageBoxes":html_imageBoxes});
    });
});


module.exports = router;