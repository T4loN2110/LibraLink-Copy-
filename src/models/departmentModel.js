const mongoose = require('mongoose');
const deparment = mongoose.Schema({
    sdt:{
        type: String,
        require: true
    },
    dia_chi:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('deparment',deparment,'CoSo');