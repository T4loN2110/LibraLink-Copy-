const mongoose = require('mongoose');
const comment = mongoose.Schema({
    ten:{
        type: String,
        require: true
    },
    book:{
        type: String,
        require: true
    },
    ngay_dang:{
        type: Date,
        require: true
    },
    noi_dung:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('comment',comment,'BinhLuan');