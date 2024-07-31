const express = require('express');
const router = express.Router();

var auth=require('../utils/auth-helper');
const fs = require("fs");
const userModel=require('../models/userModel')
const invoiceModel = require('../models/invoiceModel');
const genreModel=require('../models/genreModel');
const bookModel=require('../models/bookModel');
const departmentModel = require('../models/departmentModel');
const requestBorrow=require('../models/requestBorrowModel');
const ObjectID = require('mongodb').ObjectId;
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/images')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage });

//done
router.get('/', async (req, res) => {
  res.locals.user = req.session.user;
  const books=await bookModel.find();
  res.render('index',{books:books})
  
});
// class User {
//   constructor(uid,username,password,role,uname,email,phone) {
//       this.uid = uid;
//       this.username = username;
//       this.password = password;
//       this.role = role;
//       this.name = uname;
//       this.email = email;
//       this.phone = phone;
//   }

// }
//done
// router.get('/books',async (req, res) => {
//   res.locals.user = req.session.user;
//   const id=req.query.id
//   const book=await bookModel.find({_id:id});
//   res.render('books',{book:book});
// });
//1 route 1 trang thoi m chinh cua t lam j
//muon thi tu tao nut bam ma cho qua route khac chu?
//luoi qua dem test ti gi cang
//done
router.get('/finance_invoice',async (req, res) => {
  res.locals.user = req.session.user;
  res.render('finance_invoice');
});
//done
//done
router.get('/library_activities_management',async (req, res) => {
  res.locals.user = req.session.user;
  res.render('library_activities_management');
});
//done
router.get('/all_invoices_management',async (req, res) => {
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 

  var type=req.session.filter.filter1;
  var type2=req.session.filter.filter2;
  var query1 = {}
  var query2 = {}
  if(type=="All")
  {
    query1 = {}
  }
  else{
    query1 = {loai_hd:(type)}
  }
  if (type2=="All")
  {
    query2 = {}
  }
  else
  {
    if (type2=="Pending")
      query2 = {ngay_tra:(null)};
    if (type2=="Confirmed")
      query2 = {ngay_tra:{$ne:null}};
  }


  let query = {...query1,...query2};

  var invoice = await invoiceModel.find((query)).skip((perPage * page) - perPage).limit(perPage)
      const count = await invoiceModel.countDocuments((query) )
      

    res.render('all_invoices_management', {
      invoice, // sản phẩm trên một page
      current: page, // page hiện tại
      pages: Math.ceil(count / perPage) // tổng số các page

  });


});

//?
router.get('/create_invoice',async (req, res) => {
  res.locals.user = req.session.user;
  res.render('create_invoice');
});
//done
router.post('/borrow',async (req,res)=>
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

 
  hantra=new Date(req.body.ngay_muon)
  hantra.setDate(hantra.getDate()+7)
  const newReq=new requestBorrow({
    nguoi_dat:ObjectID.createFromHexString(req.session.user.id),
    sach:ObjectID.createFromHexString(req.body.sach),
    ngay_muon:new Date(req.body.ngay_muon),
    co_so:ObjectID.createFromHexString(req.body.co_so),
    han_tra:hantra,
    trang_thai:0,
    nguoi_xac_nhan:null,
    ghi_chu:req.body.ghi_chu
  })
  try{await newReq.save();}
  catch(err) 
  {
    console.log(err)
    return res.send({errMes:err.message})
  }
  return res.send();
});

//done
router.get('/book_management',async (req, res) => {
  res.locals.user = req.session.user;
  res.render('book_management');
});
//done
router.post('/search',async (req, res) => {
  res.locals.user = req.session.user;
  const genres=await genreModel.find();
  const searchBy=req.body.searchBy;
  const searchContent=req.body.searchContent;
  var books;
  if(searchBy=="author")
  {
    var books=await bookModel.find({tac_gia:new RegExp('^.*'+searchContent+'.*$')});
  }
  else if (searchBy=="title")
  {
    var books=await bookModel.find({ten:new RegExp('^.*'+searchContent+'.*$')});
  }
  else{
    return res.render('error',{errMes:"How did u get here?"});
  }
  res.render('search',{genres:genres,books:books});
});
//done
router.post('/login',async function(req, res, next) {

  //client.connect()
  var username = req.body.username;
  const user = await userModel.findOne({username:username})
  if(user===null) return res.send({errMes:"Username doesn't exist"})
  const password=req.body.password;
  const result=await auth.comparePassword(password,user.password)
  if(result)
  {
    //req.session.user={id:user._id,username:user.username}
    req.session.user={id:user._id,username:user.username}
    req.session.filter={filter1:"All",filter2:"All"}
    req.session.filter_request={filter:"All"}
    return res.send();
   }
   return res.send({errMes:"Incorrect password"})
});
//done
router.post('/signUp',async function(req, res, next) {
  const username=req.body.name
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
  //let user2=new User('',req.body.username,req.body.password,req.body.name,1,'','')
  let password=req.body.password
  let re_password=req.body.rePassword
  if(password===re_password)
  {
      user.password=await auth.hashPassword(password);
    /*auth.hashPassword2(password,(encrypt)=>
    {
      const user=new userModel({
        username:req.body.username,
        password:encrypt,
      })
    })*/
    
    //collection.insertOne(user)
    // collection.insertOne(user2)
    try
    {
      await user.save()
    }
    catch(err)
    {
      console.log(err)
      return res.send(err.message);
    }
    return res.send();
  }
  res.send({errMes:"Password and re-enter password does not match!"})
});
//done
router.get('/logout', (req, res) => {
  req.session.user = null
  req.session.destroy();
  //client.close()
  res.redirect('/');
  
});
//Finance
//done
router.post('/createinvoice', async function(req, res, next) {

  let inv=new invoiceModel({
    uid:req.body.uid,
    loai_hd:req.body.loai_hd,
    ngay_tao:req.body.ngay_tao,
    ngay_tra:null,
    ghi_chu:req.body.ghi_chu,
    chitiet:req.body.chitiet,
    so_tien:req.body.so_tien
  })
  await inv.save()
  res.redirect('/');
});


router.get('/meh', async(req, res) => {
  books=await bookModel.find()
  departments=await departmentModel.find();
  res.render('meh',{books: books,departments:departments,errMes:""})
});
router.post('/meh',upload.single('anh_bia_sach'),async (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString('base64');
  var final_img = {
    data:Buffer.from(encode_img,'base64'),
    contentType:req.file.mimetype,
};
  const dep=await departmentModel.findOne({_id:req.body.ma_co_so_sach})
  let book=new bookModel(
    {
      ten:req.body.ten_sach,
      nam_xb:req.body.nam_xb_sach,
      tac_gia:req.body.tac_gia_sach,
      tom_tat:req.body.tom_tat_sach,
      gia_bia:req.body.gia_bia_sach,
      anh_bia:final_img,
      co_so:{ma_co_so:dep._id,dia_chi:dep.dia_chi,sdt:dep.sdt,so_luong:req.body.so_luong_sach}
    }
  )
  try{
    await book.save()
  }catch(err)
  {
    return res.send({errMes:err.message});
  }
  res.contentType(final_img.contentType);
  res.redirect("/meh");
});

router.get('/tmetmoiqua', async(req, res) => {
  res.render('tmetmoiqua');
});

router.post('/tmetmoiqua',async (req, res) => {
  let dep=new departmentModel(
    {
      sdt:req.body.sdt,
      dia_chi:req.body.dia_chi,
    }
  )
  var check=await departmentModel.find({sdt:dep.sdt,dia_chi:dep.dia_chi})
  if(check!=null)
  {
    return res.send("Bruh")
  }
  departmentModel.create(dep).then((err,result)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Saved To database");
    }});
    res.render('tmetmoiqua');
});
router.get('/all_invoices_management/:page',async (req, res) => {
  if(!req.session.user)
  {
    res.render("index");
  }
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 
  var query1 = {}
  var query2 = {}
  var type=req.session.filter.filter1;
  var type2=req.session.filter.filter2;
  if(type=="All")
  {
    query1 = {}
  }
  else{
    query1 = {loai_hd:(type)}
  }
  if (type2=="All")
  {
    query2 = {}
  }
  else
  {
    if (type2=="Pending")
      query2 = {ngay_tra:(null)};
    if (type2=="Confirmed")
      query2 = {ngay_tra:{$ne:null}};
  }

  let query = {...query1,...query2};

  var invoice = await invoiceModel.find((query)).skip((perPage * page) - perPage).limit(perPage)
      const count = await invoiceModel.countDocuments((query) )

        res.render('all_invoices_management', {
          invoice, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page

      });


});

router.post('/search_invoice',async (req, res, next) => {
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 

  var type=req.body.invoice_type;
  var type2=req.body.invoice_type2;
  req.session.filter={type,type2}
  
  var query1 = {}
  var query2 = {}
  if(type=="All")
  {request
    query1 = {}
  }
  else{
    query1 = {loai_hd:(type)}
  }
  if (type2=="All")
  {
    query2 = {}
  }
  else
  {
    if (type2=="Pending")
      query2 = {ngay_tra:(null)};
    if (type2=="Confirmed")
      query2 = {ngay_tra:{$ne:null}};
  }

  let query = {...query1,...query2};

  var invoice = await invoiceModel.find((query)).skip((perPage * page) - perPage).limit(perPage)
      const count = await invoiceModel.countDocuments((query) )
      console.log(invoice)
        res.render('all_invoices_management', {
          invoice, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page
        });


});

router.get('/delete_invoice',async (req, res) => {
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 
  const id=req.query.id
  const query = { _id: id };
  await invoiceModel.deleteOne(query);
  var query1 = {}
  var query2 = {}

  var type=req.session.filter.filter1;
  var type2=req.session.filter.filter2;

  
  if(type=="All")
  {
    query1 = {}
  }
  else{
    query1 = {loai_hd:(type)}
  }
  if (type2=="All")
  {
    query2 = {}
  }
  else
  {
    if (type2=="Pending")
      query2 = {ngay_tra:(null)};
    if (type2=="Confirmed")
      query2 = {ngay_tra:{$ne:null}};
  }


  let query0 = {...query1,...query2};

  var invoice = await invoiceModel.find((query0)).skip((perPage * page) - perPage).limit(perPage)
      const count = await invoiceModel.countDocuments((query0) )
      

        res.render('all_invoices_management', {
          invoice, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page

      });

});
router.get('/update_invoice',async (req, res) => {
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 
  
  const id=req.query.id
  const query = { _id: id };
  const date = new Date()
  const update = {ngay_tra: date}
  
  let doc = await invoiceModel.updateOne(query,update);

  var type=req.body.invoice_type;
  var type2=req.body.invoice_type2;
  req.session.filter.filter1=type
  req.session.filter.filter2=type2

  var query1 = {}
  var query2 = {}

  
  if(type=="All")
  {
    query1 = {}
  }
  else{
    query1 = {loai_hd:(type)}
  }
  if (type2=="All")
  {
    query2 = {}
  }
  else
  {
    if (type2=="Pending")
      query2 = {ngay_tra:(null)};
    if (type2=="Confirmed")
      query2 = {ngay_tra:{$ne:null}};
  }
  let query0 = {...query1,...query2};

  var invoice = await invoiceModel.find((query0)).skip((perPage * page) - perPage).limit(perPage)
      const count = await invoiceModel.countDocuments((query0) )
      

        res.render('all_invoices_management', {
          invoice, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page

      });

});
///////////////////

router.get('/book_request_management',async (req, res) => {
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 

  var type=req.session.filter_request.filter;
  
  if(type=="All")
  {
    query = {}
  }
  else{
    if (type=="Borrow")
      query = {trang_thai:(0)};
      if (type=="Confirmed")
      query = {trang_thai:(1)};
      if (type=="Extend")
      query = {loai:(1)};
  }
      var request = await requestBorrow.find(query).skip((perPage * page) - perPage).limit(perPage)
      const count = await requestBorrow.countDocuments((query))
      console.log(count)

        res.render('book_request_management', {
          request, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page

      });


});

router.get('/book_request_management/:page',async (req, res) => {
  if(!req.session.user)
  {
    res.render("index");
  }
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 

  var type=req.session.filter_request.filter;
  
  if(type=="All")
  {
    query = {}
  }
  else{
    if (type=="Borrow")
      query = {trang_thai:(0)};
      if (type=="Confirmed")
      query = {trang_thai:(1)};
      if (type=="Extend")
      query = {loai:(1)};
  }

      var request = await requestBorrow.find((query)).skip((perPage * page) - perPage).limit(perPage)
      const count = await requestBorrow.countDocuments((query))
      

        res.render('book_request_management', {
          request, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page

      });


});

router.get('/search_request',async (req, res) => {
  if(!req.session.user)
  {
    res.render("index");
  }
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 

  var type=req.session.filter_request.filter;
  
  if(type=="All")
  {
    query = {}
  }
  else{
    if (type=="Borrow")
      query = {trang_thai:(0)};
      if (type=="Confirmed")
      query = {trang_thai:(1)};
      if (type=="Extend")
      query = {loai:(1)};
  }
  var request = await requestBorrow.find((query)).skip((perPage * page) - perPage).limit(perPage)
      const count = await requestBorrow.countDocuments((query))

      console.log(count)
      

        res.render('book_request_management', {
          request, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page

      });


});

router.get('/reject_borrow',async (req, res) => {
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 
  const id=req.query.id
  const query = { _id: id };
  await requestBorrow.deleteOne(query);

  var type=req.session.filter_request.filter;
  
  if(type=="All")
  {
    query = {}
  }
  else{
    if (type=="Borrow")
      query = {trang_thai:(0)};
      if (type=="Confirmed")
      query = {trang_thai:(1)};
      if (type=="Extend")
      query = {loai:(1)};
  }
  
      var request = await requestBorrow.find((query)).skip((perPage * page) - perPage).limit(perPage)
      const count = await requestBorrow.countDocuments((query))
      

        res.render('book_request_management', {
          request, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page

      });


});
router.get('/confirm_borrow',async (req, res) => {
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 
  
  const id=req.query.id
  const query = { _id: id };
  const update = {trang_thai: 1}
  
  let doc = await requestBorrow.updateOne(query,update);
  var type=req.session.filter_request.filter;
  
  if(type=="All")
  {
    query = {}
  }
  else{
    if (type=="Borrow")
      query = {trang_thai:(0)};
      if (type=="Confirmed")
      query = {trang_thai:(1)};
      if (type=="Extend")
      query = {loai:(1)};
  }
      var request = await requestBorrow.find((query)).skip((perPage * page) - perPage).limit(perPage)
      const count = await requestBorrow.countDocuments((query))
      

        res.render('book_request_management', {
          request, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page

      });


});

module.exports = router;
