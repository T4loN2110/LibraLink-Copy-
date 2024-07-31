const { name } = require('ejs');
const mongoose = require('mongoose');
const invoice = mongoose.Schema({
    uid:{
        type: String,
        require: true
    },
    loai_hd:{
        type: String,
        require: true
    },
    ngay_tao:{
        type: Date,
        require: true
    },
    ngay_tra:
    {
        type:Date,
        default:null
    },
    han_tra:
    {
        type:Date,
        require: true
    },
    so_tien:{
        type: Number,
        require: true
    },
    ghi_chu: String,  
    chitiet: [{isbn:String,ten:String,so_luong:Number,don_gia:Number}],
    tao_hd:
    {
        type:Boolean,
        require:true,
        default:false,
    }
});

module.exports = mongoose.model('invoice',invoice,'HoaDon');