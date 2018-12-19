var express=require('express');
var router = express.Router();
var login=require('./login.js');

var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User_picture=require('../model/user_picture');

router.get('/',function(req,res){
    if (!req.session.logged_in) {
        login.Notlogin(req, res);
    } else {
        res.render('upload.ejs', {
            title:"editor",
        });
    }
});
router.post('/',urlencodedParser, function(req, res){
    //接收前台POST过来的base64
    //过滤data:URL
    if(!req.session.logged_in){
        res.redirect('/');
        return;
    }
    console.log("start uploading!");
    var labels=req.body.labels;
    var base64Data = req.body.imgData.replace(/^data:image\/\w+;base64,/, "");
    var userName=req.session.username;
    var dataBuffer = new Buffer(base64Data, 'base64');
    var path = 'public/upload/'+userName;
    var fileName="common-"+Date.now()+'.png';
    var user_picture = new User_picture({
        username:userName,
        picture:fileName,
        labels:labels,
        likes:0
    });
    fs.exists(path,function(exists){
        if(!exists){
            fs.mkdir(path,function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('创建目录成功');
                fs.writeFile(path+'/'+fileName, dataBuffer, { 'flag': 'a' },function(err) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("图片保存成功！");
                    }
                });
            });
        }else{
            fs.writeFile(path+'/'+fileName, dataBuffer, { 'flag': 'a' },function(err) {
                if(err){
                    console.log(err);
                }else{
                    console.log("图片保存成功！");
                }
            });
        }
    });
    user_picture.save(function(res,req,err) {
        if (err) {
            console.log('保存失败');
            return;
        }
        console.log('图片数据库保存成功');
    });
});
module.exports = router;