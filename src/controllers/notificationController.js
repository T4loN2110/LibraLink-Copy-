const ObjectID = require('mongodb').ObjectId;
const invoiceModel=require('../models/invoiceModel');
const requestModel=require('../models/requestModel');
const notificationModel=require('../models/notificationModel')
const asyncHandler = require("express-async-handler");
const bookModel = require('../models/bookModel');


exports.showNotifications=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;
    const uid=req.session.user.id;
    const allNoti=await notificationModel.find({uid:uid},{loai_thong_bao:1,ngay_tao:1,hoa_don:1,trang_thai:1})
    res.render('notification_page',{allNoti:allNoti});
})
exports.getNotification=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    const id=req.query.id
    const noti=await notificationModel.findOne({_id:id},{loai_thong_bao:1,hoa_don:1,trang_thai:1,ngay_toi_han:1})
    var notiDetail
    var fullDetail=[]
    var notiDetails
    if(noti.loai_thong_bao!=3)
    {
        notiDetail=await invoiceModel.findOne({_id:noti.hoa_don},{chi_tiet:1,so_tien:1,ngay_tao:1})
        if(notiDetail.chi_tiet.length!=0)
        {
            notiDetail.chi_tiet.forEach(async element => {
                const book=await bookModel.findOne({isbn:element.isbn},{ten:1,anh_bia:1,tac_gia:1})
                const detailInv={
                    ten:book.ten,
                    anh_bia:book.anh_bia,
                    tac_gia:book.tac_gia,
                    don_gia:element.don_gia,
                    so_luong:element.so_luong
                }
                fullDetail.push(detailInv)
            });
        }
        notiDetails={
            loai_thong_bao:noti.loai_thong_bao,
            trang_thai:noti.trang_thai,
            ngay_tao:notiDetail.ngay_tao,
            ngay_toi_han:noti.ngay_toi_han,
            so_tien:notiDetail.so_tien,
            chi_tiet:fullDetail
        }
    }
    else
    {
        notiDetail=await requestModel.findOne({_id:noti.hoa_don},{ngay_gui:1,ma_sach:1})
        const book=await bookModel.findOne({_id:notiDetail.ma_sach},{ten:1,anh_bia:1,tac_gia:1})
        const detailReq={
            ten:book.ten,
            anh_bia:book.anh_bia,
            tac_gia:book.tac_gia,
        }
        fullDetail.push(detailReq)
        notiDetails={
            loai_thong_bao:noti.loai_thong_bao,
            trang_thai:noti.trang_thai,
            ngay_tao:notiDetail.ngay_gui,
            ngay_toi_han:noti.ngay_toi_han,
            chi_tiet:fullDetail
        }
    }
    return res.send({notiDetails:notiDetails})
})