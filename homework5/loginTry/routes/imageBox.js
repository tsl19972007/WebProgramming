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
        res.render('imageBox.ejs', {
            title:"imageBox",
        });
    }
});

router.get('/showPictures',function(req,res){
    console.log("show2");
    var boxID=req.query.id;
    console.log(boxID);
    var html_pictures="";
    var  boxToFind={
        boxID:boxID
    };
    User_imageBox.find(boxToFind,function (err, user_picture) {
        for(var i=0;i<user_picture[0].pictures.length;i++){
            var url="upload/"+user_picture[0].username+"/box-small-"+user_picture[0].pictures[i];
            var m1=-125*(i%6);
            var m2=-125*parseInt(i/6);
            var html_picture="<div style=\"background-position:"+m1+"px "+m2+"px;\"><img src="+url+"></div>";
            html_pictures+=html_picture;
        }
        res.json({"html_pictures":html_pictures});
    });
});


module.exports = router;
