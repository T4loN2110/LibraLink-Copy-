const bookModel=require('../models/bookModel');
const commentModel=require('../models/commentModel');
const requestModel = require('../models/requestModel');
const request=require('../models/requestModel');
const asyncHandler = require("express-async-handler");
const userModel = require('../models/userModel');
const favouriteModel=require('../models/favoriteModel');
const ObjectID = require('mongodb').ObjectId;

exports.getBookInfo=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/')
    res.locals.user = req.session.user;
    var user = req.session.user;
    const id=req.query.id
    const book=await bookModel.findOne({_id:id});
    let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.query.page || 1; 
    var comment = await commentModel.find({book:book._id}).skip((perPage * page) - perPage).limit(perPage)
    const count = await commentModel.countDocuments({isbn:book.isbn})
    tmp = await favouriteModel.find({uid:user.id,isbn:book.isbn})
    if (tmp.length==0){
      check =false
    }
    else {
      check=true
    }
        res.render('books', {
          comment,
          book:book,
          check:check,
           // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page
        });

})

exports.createBorrowRequest=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) 
  {
    return res.send({errMes:"Please login first!"});
  }
  var book=await bookModel.findById(req.body.sach);
  for(var coso of book.co_so)
  {
    if(coso.ma_co_so==req.body.co_so)
    {
      coso.so_luong-=1
      if(coso.so_luong<0) return res.send({errMes:"This book had none in stock left :>"})
    }
  }
  try{await book.save();}
  catch(err)
  {
    console.log(err)
    return res.send({errMes:err.message})
  }
  var hantra=new Date(req.body.ngay_gui)
  hantra.setDate(hantra.getDate()+7)
  const newReq=new request({
    uid:ObjectID.createFromHexString(req.session.user.id),
    nguoi_dat:req.session.user.username,
    ma_sach:ObjectID.createFromHexString(req.body.sach),
    ten_sach:book.ten,
    tac_gia:book.tac_gia,
    ngay_gui:new Date(req.body.ngay_gui),
    gia_han:true,
    co_so:ObjectID.createFromHexString(req.body.co_so),
    ngay_tra:null,
    han_tra:null,
    loai_don:0,
    trang_thai:0,
    nguoi_xac_nhan:null,
    ghi_chu:req.body.ghi_chu
  })
  await newReq.save();
  return res.send();
});

exports.getAllBorrowRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;
    var type=-2,status=-2
    var query={}
    if(!req.session.allRequest)
    {
      req.session.allRequest={type:-2,status:-2}
    }
    else{
      type=Number(req.session.allRequest.type)
      status= Number(req.session.allRequest.status)
      if(type!=-2&&status==-2)
      {
        query={loai_don:type}
      }
      else if(type==-2&&status!=-2)
      {
        query={trang_thai:status}
      }
      else if(type!=-2&&status!=-2){
        query={loai_don:type,trang_thai:status}
      }
    }
    let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 
    const request=await requestModel.find(query,{ma_sach:1,ten_sach:1,nguoi_dat:1,loai_don:1,trang_thai:1,ngay_gui:1,ngay_tra:1,han_tra:1,gia_han:1}).skip((perPage * page) - perPage).limit(perPage);
    const count = await requestModel.countDocuments(query);
      res.render('book_request_management', {
      request: request,
      current: page,
      pages: Math.ceil(count / perPage),
      requestType:type,
      requestStatus:status,
    });
})
exports.getUserBorrowRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  res.locals.user = req.session.user;
  const uid=req.session.user.id
  var type=-2,status=-2
  var query={uid:uid}
  if(!req.session.selfRequest)
  {
    req.session.selfRequest={type:-2,status:-2}
  }
  else{
    type=Number(req.session.selfRequest.type)
    status= Number(req.session.selfRequest.status)
    if(type!=-2&&status==-2)
    {
      query={loai_don:type,uid:uid}
    }
    else if(type==-2&&status!=-2)
    {
      query={trang_thai:status,uid:uid}
    }
    else if(type!=-2&&status!=-2){
      query={loai_don:type,trang_thai:status,uid:uid}
    }
  }
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 
  const request=await requestModel.find(query,{ma_sach:1,ten_sach:1,nguoi_dat:1,loai_don:1,trang_thai:1,ngay_gui:1,ngay_tra:1,han_tra:1,gia_han:1}).skip((perPage * page) - perPage).limit(perPage);
  const count = await requestModel.countDocuments(query);
    res.render('viewSelfRequest', {
    request: request,
    current: page,
    pages: Math.ceil(count / perPage),
    requestType:type,
    requestStatus:status,
  });
});
exports.extendRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  const id=req.query.id;
  await requestModel.updateOne({_id:id,trang_thai:{$ne:3}},{loai_don:1});
  res.redirect(301,'back');
});

exports.confirmRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  const id=req.query.id;
  const ureq=await requestModel.findOne({_id:id},{ngay_gui:1})
  var han_tra=new Date(ureq.ngay_gui);
  han_tra.setDate(han_tra.getDate()+7);
  const nguoiXacNhan=req.session.user.id
  await requestModel.updateOne({_id:id,trang_thai:{$ne:3}},{trang_thai:1,loai_don:2,han_tra:han_tra,nguoi_xac_nhan:ObjectID.createFromHexString(nguoiXacNhan)});
  res.redirect(301,'back');
});
exports.confirmReturnRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  const id=req.query.id;
  var ngaytra=new Date();
  const nguoiXacNhan=req.session.user.id
  await requestModel.updateOne({_id:id,trang_thai:{$ne:3}},{trang_thai:2,ngay_tra:ngaytra,nguoi_xac_nhan_tra:ObjectID.createFromHexString(nguoiXacNhan)});
  res.redirect(301,'back');
});
exports.confirmExtendRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  const id=req.query.id;
  var userRequest=await requestModel.findOne({_id:id,trang_thai:{$ne:3}});
  var hantra=userRequest.han_tra
  hantra.setDate(hantra.getDate()+7);
  const nguoiXacNhan=req.session.user.id
  await requestModel.updateOne({_id:id,trang_thai:{$ne:3}},{han_tra:hantra,loai_don:2,gia_han:false,nguoi_xac_nhan_gia_han:ObjectID.createFromHexString(nguoiXacNhan)});
  res.redirect(301,'back');
});
exports.rejectRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  const id=req.query.id;
  await requestModel.updateOne({_id:id,trang_thai:{$ne:3}},{trang_thai:-1});
  const ureq=await requestModel.findOne({_id:id},{ma_sach:1,co_so:1})
  const dm=await bookModel.updateOne({_id:ureq.ma_sach,'co_so.ma_co_so':ureq.co_so},{$inc:{"co_so.$.so_luong":1}})

  //res.redirect(301,'back');
  res.redirect('back');
});
exports.rejectExtendRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  const id=req.query.id;
  await requestModel.updateOne({_id:id,trang_thai:{$ne:3}},{gia_han:true,trang_thai:1,loai_don:2});
  
  
  //res.redirect(301,'back');
  res.redirect(301,'back');
});

exports.searchAllRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;
    let page = req.params.page || 1; 
    const type=Number(req.body.requestType)
    const status= Number(req.body.requestStatus)
    req.session.allRequest.type=type
    req.session.allRequest.status=status
    
    return res.redirect('/borrow/allRequest/'+page)
});
exports.searchUserRequest=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  res.locals.user = req.session.user;
  let page = req.params.page || 1; 
  const type=Number(req.body.requestType)
  const status= Number(req.body.requestStatus)
  req.session.selfRequest.type=type
  req.session.selfRequest.status=status
  
  return res.redirect('/borrow/selfRequest/'+page)
});