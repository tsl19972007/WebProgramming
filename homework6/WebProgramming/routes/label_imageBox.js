var express=require('express');
var router = express.Router();
var login=require('./login.js');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User_imageBox=require('../model/user_imageBox');

router.get('/',function(req, res) {
    if (!req.session.logged_in) {
        login.Notlogin(req, res);
    } else {
        var label=req.query.label;
        res.render('label_imageBox.ejs', {
            label:label,
        });
    }
});

router.get('/showImageBoxes',function(req,res){
    var label=req.query.label;
    var searchBy=req.query.searchBy;
    console.log(label);
    var html_imageBoxes="";
    var  boxToFind={
        labels:label
    };
    User_imageBox.find(boxToFind,function (err, user_imageBox) {
        if(searchBy=="likes"){
            user_imageBox.sort(keysort('likes',false));
            console.log("likes");
        }
        for(var i=user_imageBox.length-1;i>=0;i--){
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

function keysort(key,sortType){
    return function(a,b){
        return sortType ?~~(a[key]<b[key]):~~(a[key]>b[key])
    }
}
module.exports = router;
