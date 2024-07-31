const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const requestBorrow = mongoose.Schema({
    uid:
    {
        type: ObjectId,
        require: true
    },
    nguoi_dat:{
        type: String,
        require: true
    },
    ma_sach:{
        type:ObjectId,
        require: true,
    },
    ten_sach:{
        type:String,
        require: true,
    },
    tac_gia:{
        type:String,
        require: true,
    },
    ngay_gui:{
        type: Date,
        require: true
    },
    gia_han:
    {
        type:Boolean,
        require:true
    },
    co_so:
    {
        type: ObjectId,
        require: true
    },
    ngay_tra:{
        type: Date
    },
    han_tra:{
        type: Date
    },
    loai_don:
    {
        type:Number,
        require:true,
        enum:[0,1,2]//0 là mượn, 1 là gia hạn, 2 là trả
    },
    trang_thai:{
        type: Number,
        require: true,
        enum:[-1,0,1,2,3]//-1 là hủy, 0 là chưa xác nhận, 1 là xác nhận mượn, 2 là xác nhận trả, 3 là quá hạn
    },
    nguoi_xac_nhan_muon:{
        type: ObjectId,
        default:null
    },
    nguoi_xac_nhan_gia_han:{
        type: ObjectId,
        default:null
    },
    nguoi_xac_nhan_tra:{
        type: ObjectId,
        default:null
    },
    ghi_chu:String,
    tao_tb:
    {
        type:Boolean,
        require:true,
        default:false,
    },
    tao_hd:
    {
        type:Boolean,
        require:true,
        default:false,
    }
});

module.exports = mongoose.model('requestBorrow',requestBorrow,'YeuCau');