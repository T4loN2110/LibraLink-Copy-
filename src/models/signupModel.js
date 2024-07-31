const mongoose = require('mongoose');
const sign_up = mongoose.Schema({
    username:{
        type: String,
        require: true    
    },
    password:{
        type: String,
        require: true    
    },
    ho_ten:{ 
        type: String,
        require: true
    }
});

module.exports = mongoose.model('sign_up',sign_up,'DangKy');