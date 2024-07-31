const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const notification = mongoose.Schema({
    uid:
    {
        type:ObjectId,
        require:true
    },
    loai_thong_bao:
    {
        type:Number,
        require:true,
        enum:[1,2,3] //1 là thông báo hóa đơn làm hư sách, 2 là thông báo đóng tiền hằng năm, 3 là thông báo trả sách
    },
    hoa_don:
    {
        type:ObjectId,
        require:true
    },
    trang_thai:
    {
        type:Number,
        require:true,
        default:0,
        enum:[0,1] //0 là chưa quá hạn, 1 là đã quá hạn
    },
    ngay_tao:
    {
        type:Date,
        require:true
    },
    ngay_toi_han:
    {
        type:Date,
        require:true
    }
});

module.exports = mongoose.model('notification',notification,'ThongBao');