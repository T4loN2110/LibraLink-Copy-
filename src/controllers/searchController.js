const bookModel=require('../models/bookModel');
const genreModel=require('../models/genreModel')
const favouriteModel=require('../models/favoriteModel')
const asyncHandler = require("express-async-handler");
const ObjectID = require('mongodb').ObjectId;

// exports.searchBook2=(asyncHandler(async(req,res,next)=>
// {
//     res.locals.user = req.session.user;
//     const genres=await genreModel.find();
//     const searchBy=req.session.search.by;
//     const searchContent=req.session.search.content;
//     var tag=req.session.search.tag;
//     console.log(tag)
//     var query; 
//     if (!tag){
//       query={}
//     }
//     else{
//       query={the_loai:tag}
//     }
//     let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
//     let page = req.query.page || 1; 
//     var count = 0

//     console.log(query)
//     var books;
//     if(searchBy=="author")
//     {
//       var books=await bookModel.find({tac_gia:new RegExp('^.*'+searchContent+'.*$','i'),query}).skip((perPage * page) - perPage).limit(perPage);
//       count = await bookModel.countDocuments({tac_gia:new RegExp('^.*'+searchContent+'.*$','i'),query})
//     }
//     else if (searchBy=="title")
//     {
//       var books=await bookModel.find({ten:new RegExp('^.*'+searchContent+'.*$','i'),query}).skip((perPage * page) - perPage).limit(perPage);
//       count = await bookModel.countDocuments({ten:new RegExp('^.*'+searchContent+'.*$','i'),query})
//     }
//     else{
//       var books=await bookModel.find(query);
//       count = await bookModel.countDocuments(query)
//     }
//     var user=req.session.user;
//     let check = [];
//     if (books){
//     for (var i=0; i<books.length;i++){
//     tmp = await favouriteModel.find({uid:user.id,isbn:books[i].isbn}).skip((perPage * page) - perPage).limit(perPage)
//     if (tmp.length==0){
//       check[i] =false
//     }
//     else {
//       check[i]=true
//     }}}
//     res.render('search',{genres:genres,books:books,check:check,current: page, // page hiện tại
//     pages: Math.ceil(count / perPage)});
    
  
// }))

exports.searchBook1=(asyncHandler(async(req,res,next)=>
{
  //if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;
    let page = req.params.page || 1; 
    if(!req.session.search || !req.session.user){
      req.session.search={by:"",content:"",tag:[]}
    }
    req.session.search.by=req.body.searchBy2;
    req.session.search.content=req.body.searchContent2;
    req.session.search.tag=req.body.tag;

    if (req.session.search.tag==undefined){
      req.session.search.tag=[]
    }
    return res.redirect('/search/'+page)
  
}))

exports.searchBook=(asyncHandler(async(req,res,next)=>
{
  
    res.locals.user = req.session.user;
    let page = req.params.page || 1; 
    if(!req.session.search){
      req.session.search={by:"",content:"",tag:[]}
    }
    req.session.search.by=req.body.searchBy;
    req.session.search.content=req.body.searchContent;
    req.session.search.tag=[]
    
    return res.redirect('/search/'+page)
  
}))

exports.searchBook0=(asyncHandler(async(req,res,next)=>
{
    res.locals.user = req.session.user;
    const genres=await genreModel.find();
    const searchBy=req.session.search.by;
    const searchContent=req.session.search.content;
    const tag=req.session.search.tag
    let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 
    var count = 0
    var books;
    if(tag.length==0) 
    {
      if(searchBy=="" || searchContent=="")
      {
        var books=await bookModel.find({the_loai:{$all:tag}}).skip((perPage * page) - perPage).limit(perPage);
        count = await bookModel.countDocuments({the_loai:{$all:tag}})
      }
      if(searchBy=="author")
    {
      var books=await bookModel.find({tac_gia:new RegExp('^.*'+searchContent+'.*$','i')}).skip((perPage * page) - perPage).limit(perPage);
      count = await bookModel.countDocuments({tac_gia:new RegExp('^.*'+searchContent+'.*$','i')})
    }
    else if (searchBy=="title")
    {
      var books=await bookModel.find({ten:new RegExp('^.*'+searchContent+'.*$','i')}).skip((perPage * page) - perPage).limit(perPage);
      count = await bookModel.countDocuments({ten:new RegExp('^.*'+searchContent+'.*$','i')})
    }}
    else
    {

      if(searchBy=="" || searchContent=="")
      {
        var books=await bookModel.find({the_loai:{$all:tag}}).skip((perPage * page) - perPage).limit(perPage);
        count = await bookModel.countDocuments({the_loai:{$all:tag}})
      }
      if(searchBy=="author")
      {
        var books=await bookModel.find({tac_gia:new RegExp('^.*'+searchContent+'.*$','i'),the_loai:{$all:tag}}).skip((perPage * page) - perPage).limit(perPage);
        count = await bookModel.countDocuments({tac_gia:new RegExp('^.*'+searchContent+'.*$','i'),the_loai:{$all:tag}})
      }
      else if (searchBy=="title")
      {
        var books=await bookModel.find({ten:new RegExp('^.*'+searchContent+'.*$','i'),the_loai:{$all:tag}}).skip((perPage * page) - perPage).limit(perPage);
        count = await bookModel.countDocuments({ten:new RegExp('^.*'+searchContent+'.*$','i'),the_loai:{$all:tag}})
      }
    }
    var user=req.session.user;
    let check = [];
    if (books){
    for (var i=0; i<books.length;i++){
      if (user){
    tmp = await favouriteModel.find({uid:user.id,isbn:books[i].isbn})
      }
      else{
        tmp = await favouriteModel.find({isbn:books[i].isbn})
      }if (tmp.length==0){
      check[i] =false
    }
    else {
      check[i]=true
    }}}

    res.render('search',{genres:genres,books:books,check:check,current: page, // page hiện tại
    pages: Math.ceil(count / perPage)});
  
}))