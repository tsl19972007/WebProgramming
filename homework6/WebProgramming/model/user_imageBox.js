var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;
//骨架模版
var ubSchema = new Schema({
    username   : String,
    boxID   : String,
    title   : String,
    likes : Number,
    pictures    : [String],
    labels : [String]
});



var user_imageBox = mongoose.model('user_imageBox', ubSchema);
module.exports = user_imageBox;
