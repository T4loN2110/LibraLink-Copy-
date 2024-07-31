const mongoose = require('mongoose');
const genre = mongoose.Schema({
    ten:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('genre',genre,'MaTheLoai');