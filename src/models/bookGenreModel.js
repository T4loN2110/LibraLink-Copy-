const mongoose = require('mongoose');
const genre = mongoose.Schema({
    isbn:{
        type: String,
        require: true
    },
    the_loai:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('genre',genre,'TheLoai');