var express=require('express');
var router = express.Router();
var login=require('./login.js');

var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User_imageBox=require('../model/user_imageBox');

router.get('/',function(req,res){
    if (!req.session.logged_in) {
        login.Notlogin(req, res);
    } else {
        res.render('upload_s.ejs', {
            title:"upload_s",
        });
    }
});
router.post('/', urlencodedParser, function(req, res) {
    if(!req.session.logged_in){
        res.redirect('/');
        return;
    }
    var boxTitle=req.body.boxTitle;
    var labels=req.body.labels;
    var userName=req.session.username;
    var path = 'public/upload/'+userName;
    var base64Datas1=req.body.imgDatas1;
    var base64Datas2=req.body.imgDatas2;
    var len=base64Datas1.length;
    var saveNum=0;
    var pictures=[];
    console.log(boxTitle);
    console.log(base64Datas1.length);
    console.log(base64Datas2.length);

    var curTime=Date.now();
    for(var i=0;i<len;i++){
        pictures.push(curTime+"-"+i+".png");
        console.log(pictures[i]);
    }
    var user_imageBox = new User_imageBox({
        boxID:curTime,
        username:userName,
        labels:labels,
        likes:0,
        pictures:pictures,
        title:boxTitle
    });
    user_imageBox.save(function(res,req,err) {
        if (err) {
            console.log('保存失败');
            return;
        }
        console.log('图片盒数据库保存成功');
    });
    fs.exists(path,function(exists){
        if(!exists){
            fs.mkdir(path,function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('创建目录成功');
                base64Datas1.forEach(function(item,index){
                    var fileName="box-small-"+pictures[index];
                    var dataBuffer = new Buffer(item, 'base64');
                    fs.writeFile(path + '/' + fileName, dataBuffer, {'flag': 'a'}, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("图片盒保存成功！"+saveNum);
                            saveNum++;
                        }
                    });
                });
                base64Datas2.forEach(function(item,index){
                    var fileName="box-big-"+pictures[index];
                    var dataBuffer = new Buffer(item, 'base64');
                    fs.writeFile(path + '/' + fileName, dataBuffer, {'flag': 'a'}, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("图片盒保存成功！"+saveNum);
                            saveNum++;
                        }
                    });
                });
            });
        }else{
            base64Datas1.forEach(function(item,index){
                var fileName="box-small-"+pictures[index];
                var dataBuffer = new Buffer(item, 'base64');
                fs.writeFile(path + '/' + fileName, dataBuffer, {'flag': 'a'}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("图片盒保存成功！"+saveNum);
                        saveNum++;
                    }
                });
            });
            base64Datas2.forEach(function(item,index){
                var fileName="box-big-"+pictures[index];
                var dataBuffer = new Buffer(item, 'base64');
                fs.writeFile(path + '/' + fileName, dataBuffer, {'flag': 'a'}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("图片盒保存成功！"+saveNum);
                        saveNum++;
                    }
                });
            });
        }
    });
});
module.exports = router;

