const mongoose = require('mongoose');
const testArr = mongoose.Schema({
    name:String,
    content:[{content1:String,content2:Number,_id:false}]
});

module.exports = mongoose.model('testArr',testArr,'testArr');