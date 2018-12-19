var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;
//骨架模版
var upSchema = new Schema({
    username   : String,
    picture   : String,
    likes : Number,
    labels : [String]
});



var user_picture = mongoose.model('user_picture', upSchema);
module.exports = user_picture;
