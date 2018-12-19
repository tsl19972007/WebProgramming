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
        var label=req.query.label;
        res.render('label_picture.ejs', {
            label:label
        });
    }
});

router.get('/showPictures',function(req,res){
    console.log("show");
    var label=req.query.label;
    var searchBy=req.query.searchBy;
    console.log(label);
    var html_pictures="";
    var pictureToFind={
        labels:label
    };
    User_picture.find(pictureToFind,function (err, user_picture) {
        if(searchBy=="likes"){
            user_picture.sort(keysort('likes',false));
            console.log("likes");
        }
        for(var i=user_picture.length-1;i>=0;i--){
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

function keysort(key,sortType){
    return function(a,b){
        return sortType ?~~(a[key]<b[key]):~~(a[key]>b[key])
    }
}


module.exports = router;
