const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const activity = mongoose.Schema({
    id_Sach:
    {
        type:ObjectId,
        require:true
    },
    ten_sach:
    {
        type:String,
        require:true
    },
    uid:
    {
        type:ObjectId,
        require:true
    },
    nguoi_dat:
    {
        type:String,
        require:true
    },
    ngay_muon:
    {
        type:Date,
        require:true
    },
    ngay_tra:
    {
        type:Date,
        default:null
    },
    han_tra:
    {
        type:Date,
        default:null
    },

});

module.exports = mongoose.model('activity',activity,'HoatDong');