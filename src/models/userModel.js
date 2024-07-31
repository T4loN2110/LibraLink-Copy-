const mongoose = require('mongoose');
const user = mongoose.Schema({
    username:{
        type: String,
        require: true    
    },
    password:{
        type: String,
        require: true    
    },
    role:
    {
        type: Number,
        require: true
    },
    name:
    {
        type:String,
        default:null
    },
    email: String,
    phone: String,
    gender: {
        type: String,
        default: "Male",
    },
    address: {
        type: String,
        default: null,
    }
});

module.exports = mongoose.model('user',user,'TaiKhoan');