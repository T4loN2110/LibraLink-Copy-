const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const book = mongoose.Schema({
    isbn:{
        type: String,
        require: true,
        default:''
    },
    ten:{
        type: String,
        require: true,
        default:'',
    },
    nam_xb:{
        type: Number,
        require: true,
        default:0
    },
    the_loai:
    {
        type:[String],
        default:[]
    },
    tac_gia:{
        type: String,
        require: true,
        default:''
    },
    tom_tat: 
    {
        type:String,
        default:''
    },
    gia_bia:
    {
        type:Number,
        default:0
    },
    anh_bia: 
    {
        data:
        {
            type:Buffer,
            default:null
        },
        contentType:
        {
            type:String,
            default:''
        },
    },
    co_so:[
    {
        ma_co_so: ObjectId,
        dia_chi:String,
        sdt:String,
        so_luong:
        {
            type:Number,
            min:[0,"Something happen and your book is gone :>"],
            default:0
        },
        _id:false
    }]
});

module.exports = mongoose.model('book',book,'Sach');