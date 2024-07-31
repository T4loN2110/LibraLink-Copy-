const mongoose = require('mongoose');
const favorite = mongoose.Schema({
    uid:{
        type: String,
        require: true
    },
    isbn:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('favorite',favorite,'YeuThich');