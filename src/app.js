require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require("method-override");
var session = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');

const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
mongoose.connect(DATABASE_URL, CONFIG);
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

const accountRouter = require('./routes/accountRoute');
const activityRouter = require('./routes/activityRoute');
const authRouter = require('./routes/authRoute');
const bookRouter = require('./routes/bookRoute');
const borrowRouter = require('./routes/borrowRoute');
const departmentRouter = require('./routes/departmentRoute');
const financeRouter = require('./routes/financeRoute');
const homeRouter = require('./routes/homeRoute');
const notificationRouter = require('./routes/notificationRoute');
const ratingRouter = require('./routes/ratingRoute');
const searchRouter = require('./routes/searchRoute');

var app = express();
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,'public/css')));
app.use(express.static(path.join(__dirname,'public/images')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/invoice',express.static(path.join(__dirname,'public/css')));
app.use('/invoice',express.static(path.join(__dirname,'public/images')));
app.use('/invoice',express.static(path.join(__dirname, 'node_modules')));

app.use('/invoice/detail',express.static(path.join(__dirname,'public/css')));
app.use('/invoice/detail',express.static(path.join(__dirname,'public/images')));
app.use('/invoice/detail',express.static(path.join(__dirname, 'node_modules')));

app.use('/invoice/search',express.static(path.join(__dirname,'public/css')));
app.use('/invoice/search',express.static(path.join(__dirname,'public/images')));
app.use('/invoice/search',express.static(path.join(__dirname, 'node_modules')));

app.use('/account',express.static(path.join(__dirname,'public/css')));
app.use('/account',express.static(path.join(__dirname,'public/images')));
app.use('/account',express.static(path.join(__dirname, 'node_modules')));

app.use('/activity',express.static(path.join(__dirname,'public/css')));
app.use('/activity',express.static(path.join(__dirname,'public/images')));
app.use('/activity',express.static(path.join(__dirname, 'node_modules')));

app.use('/book',express.static(path.join(__dirname,'public/css')));
app.use('/book',express.static(path.join(__dirname,'public/images')));
app.use('/book',express.static(path.join(__dirname, 'node_modules')));

app.use('/borrow',express.static(path.join(__dirname,'public/css')));
app.use('/borrow',express.static(path.join(__dirname,'public/images')));
app.use('/borrow',express.static(path.join(__dirname, 'node_modules')));

app.use('/borrow/search/:id/:page',express.static(path.join(__dirname,'public/css')));
app.use('/borrow/search/:id/:page',express.static(path.join(__dirname,'public/images'))); //cho đứa nào muốn xài routes parameter tham khảo
app.use('/borrow/search/:id/:page',express.static(path.join(__dirname, 'node_modules')));

app.use('/borrow/allRequest/:page',express.static(path.join(__dirname,'public/css')));
app.use('/borrow/allRequest/:page',express.static(path.join(__dirname,'public/images')));
app.use('/borrow/allRequest/:page',express.static(path.join(__dirname, 'node_modules')));

app.use('/borrow/selfRequest/:page',express.static(path.join(__dirname,'public/css')));
app.use('/borrow/selfRequest/:page',express.static(path.join(__dirname,'public/images')));
app.use('/borrow/selfRequest/:page',express.static(path.join(__dirname, 'node_modules')));

app.use('/rating/favourite/:page',express.static(path.join(__dirname,'public/css')));
app.use('/rating/favourite/:page',express.static(path.join(__dirname,'public/images')));
app.use('/rating/favourite/:page',express.static(path.join(__dirname, 'node_modules')));

app.use('/department',express.static(path.join(__dirname,'public/css')));
app.use('/department',express.static(path.join(__dirname,'public/images')));
app.use('/department',express.static(path.join(__dirname, 'node_modules')));

app.use('/notification',express.static(path.join(__dirname,'public/css')));
app.use('/notification',express.static(path.join(__dirname,'public/images')));
app.use('/notification',express.static(path.join(__dirname, 'node_modules')));

app.use('/rating',express.static(path.join(__dirname,'public/css')));
app.use('/rating',express.static(path.join(__dirname,'public/images')));
app.use('/rating',express.static(path.join(__dirname, 'node_modules')));

app.use('/search',express.static(path.join(__dirname,'public/css')));
app.use('/search',express.static(path.join(__dirname,'public/images')));
app.use('/search',express.static(path.join(__dirname, 'node_modules')));

app.use('/search/:page',express.static(path.join(__dirname,'public/css')));
app.use('/search/:page',express.static(path.join(__dirname,'public/images')));
app.use('/search/:page',express.static(path.join(__dirname, 'node_modules')));

app.use(session({
  store: MongoStore.create({
    mongoUrl: DATABASE_URL,
    autoRemove: 'interval',
    autoRemoveInterval: 10, // In minutes. Default

  }),
  resave: false,
  saveUninitialized: true,
  secret: 'whateverthisis', 
  cookie:
   { 
    secure: false,
    httpOnly:true,
    maxAge:60*1000*60*24 
  }

}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async function (req, res, next) {
  if(!req.session.user){}
  else
  {
    const invoiceModel=require('./models/invoiceModel')
    const notificationModel=require('./models/notificationModel')
    const requestModel=require('./models/requestModel');
    await requestModel.updateMany({han_tra:{$lte:new Date()},trang_thai:1},{$set:{loai_don:2,trang_thai:3}});
    const uid=req.session.user.id;
    const notiDate=new Date();
    notiDate.setDate(notiDate.getDate()+3);
    const annInv=await invoiceModel.find({uid:uid,loai_hd:new RegExp("^Annual Fee.*$"),ngay_tra:null,han_tra:{$lte:notiDate},tao_tb:false},{_id:1,tao_tb:1});
    const dmgInv=await invoiceModel.find({uid:uid,loai_hd:"Book Damaging Invoice",ngay_tra:null,han_tra:{$lte:notiDate},tao_tb:false},{_id:1,tao_tb:1});
    const reqInv=await requestModel.find({uid:uid,loai_don:2,trang_thai:1,han_tra:{$lte:notiDate},tao_tb:false},{_id:1,tao_tb:1});
    if(dmgInv.length!=0){
      dmgInv.forEach(async element => {
          element.tao_tb=true
          const newNoti=new notificationModel({
              uid:uid,
              loai_thong_bao:1,
              hoa_don:element._id,
              ngay_tao:new Date(),
          });
          await element.save()
          await newNoti.save()
      });}
    if(annInv.length!=0){
    annInv.forEach(async element => {
        element.tao_tb=true
        const newNoti=new notificationModel({
            uid:uid,
            loai_thong_bao:2,
            hoa_don:element._id,
            ngay_tao:new Date(),
        });
        await element.save()
        await newNoti.save()
    });}
    if(reqInv.length!=0){
    reqInv.forEach(async element => {
        element.tao_tb=true
        const newNoti=new notificationModel({
            uid:uid,
            loai_thong_bao:3,
            hoa_don:element._id,
            ngay_tao:new Date(),
            ngay_toi_han:notiDate
        });
        await element.save()
        await newNoti.save();
    });}
    const pastDay=new Date()
    if (req.session.user){
    var qua_han=await requestModel.find({trang_thai:3,tao_hd:false})
      if (qua_han){
        for (var i=0; i < qua_han.length; i++){
          await requestModel.updateOne({_id:qua_han[i]._id},{tao_hd:true});
        const hantra=new Date()
          hantra.setDate(hantra.getDate()+7);
            let inv=new invoiceModel({
              uid:qua_han[i].uid,
              loai_hd:"Late Return Invoice",
              ngay_tao:new Date(),
              ngay_tra:null,
              han_tra:hantra,
              ghi_chu:"",
              chitiet:{isbn:qua_han[i].ma_sach,ten:qua_han[i].ten_sach,so_luong:1,don_gia:20000},
              so_tien:20000
      })
      await inv.save()
        
        }
      }
    }


    // pastDay.setDate(pastDay.getDate()-4);
    // const pastDay2=new Date()
    // pastDay2.setDate(pastDay.getDate()-1);
    //await notificationModel.deleteMany({ngay_toi_han:{$gte:pastDay,$lte:pastDay2}})
    const allNoti=await notificationModel.find({uid:uid},{_id:1,loai_thong_bao:1,hoa_don:1});
    for(var i=0;i<allNoti.length;i++)
    {
      if(allNoti[i].loai_thong_bao!=3)
      {
        const inv=await invoiceModel.find({_id:allNoti[i].hoa_don},{ngay_tra:1});
        if(inv.ngay_tra!=null)
        {
          notificationModel.deleteOne({_id:allNoti[i]._id})
        }
      }
      else
      {
        const req=await requestModel.find({_id:allNoti[i].hoa_don},{trang_thai:1});
        if(req.trag_thai==2)
        {
          notificationModel.deleteOne({_id:allNoti[i]._id})
        }
      }
    }
    await notificationModel.updateMany({ngay_toi_han:{$lte:new Date()}},{trang_thai:1})
    const notiCount=await notificationModel.countDocuments({uid:uid});
    res.locals.notiCount=notiCount;
  }
  
  next()
})

app.use('/account',accountRouter);
app.use('/activity', activityRouter);
app.use('/auth', authRouter);
app.use('/book', bookRouter);
app.use('/borrow', borrowRouter);
app.use('/department', departmentRouter);
app.use('/invoice', financeRouter);
app.use('/', homeRouter);
app.use('/notification', notificationRouter);
app.use('/rating', ratingRouter);
app.use('/search', searchRouter);
//check for notification



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
