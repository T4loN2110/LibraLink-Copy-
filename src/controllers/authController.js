const userModel=require('../models/userModel');
const invoiceModel=require('../models/invoiceModel')
var auth=require('../utils/auth-helper');
const asyncHandler = require("express-async-handler");
const ObjectID = require('mongodb').ObjectId;

exports.login = asyncHandler(async (req, res, next) => {
    var username = req.body.username;
    const user = await userModel.findOne({username:username})
    if(user==null) return res.send({errMes:"Incorrect username or password"})
    const password=req.body.password;
    const result=await auth.comparePassword(password,user.password)
    if(result)
    {
      req.session.user={id:user._id,username:user.username,role:user.role}
      req.session.filter={filter1:"All",filter2:"All"}
      req.session.filter_query={};
      
      req.session.filter_index=0;
      req.session.filter_query2={};
      req.session.filter_index2=0;
      return res.send();
    }
    return res.send({errMes:"Incorrect username or password"})
  });

exports.signUp=asyncHandler(async (req, res, next)=>{
    const username=req.body.username

    checkUser=await userModel.findOne({username:username});
    if(checkUser!=null)
    {
      return res.send({errMes:"Username already exist"})
    }
    
    let user=new userModel({
      name:req.body.name,
      username:req.body.username,
      role:1
    })
    let password=req.body.password
    let re_password=req.body.rePassword
    const nextYear=new Date()
    nextYear.setFullYear(nextYear.getFullYear()+1);
    if(password===re_password)
    {
      user.password=await auth.hashPassword(password);
      const newUser=await user.save()
      const annualFee=new invoiceModel({
        uid:newUser._id,
        loai_hd:"Annual Fee "+new Date().getFullYear(),
        ngay_tao:new Date(),
        han_tra:nextYear,
        so_tien:33333,
        ghi_chu:"Phí thường niên?",
        chi_tiet:null
      })
      await invoiceModel.create(annualFee)
      return res.send();
    }
    res.send({errMes:"Password and re-enter password does not match!"})
});

exports.logout=(req, res, next)=>{
    req.session.user = null
    req.session.destroy();
    //client.close()
    res.redirect('/');
};