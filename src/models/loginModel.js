const mongoose = require('mongoose');
const login = mongoose.Schema({
    username:{
        type: String,
        require: true    
    },
    password:{
        type: String,
        require: true    
    }
});

module.exports = mongoose.model('login',login,'DangNhap');