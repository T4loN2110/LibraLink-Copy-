const commentModel=require('../models/commentModel');
const bookModel=require('../models/bookModel');
const favouriteModel=require('../models/favoriteModel');
const asyncHandler = require("express-async-handler");
const ObjectID = require('mongodb').ObjectId;

exports.showFavorites=asyncHandler(async(req,res,next)=>
{
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;

  var fav = await favouriteModel.find(({uid:req.session.user.id})).skip((perPage * page) - perPage).limit(perPage)
  const count = await favouriteModel.countDocuments(({}))

  var book_array = []
  var bookisbn = []
  for (i = 0; i < fav.length; i++) {
    bookisbn.push(fav[i].isbn)
  }

  if (fav.length != 0) {
    query = {isbn:bookisbn}
    book_array = await bookModel.find((query))
  }

  res.render('favourite', {
    favourite: book_array, // sản phẩm trên một page
    current: page, // page hiện tại
    pages: Math.ceil(count / perPage) // tổng số các page
  });
})





exports.saveComment=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  res.locals.user = req.session.user;
  let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 

  var content=req.body.mycomment;
  var user=req.session.user;
  var username=user.username;

  console.log(req.query.id);
  let comment=new commentModel(
    {
    ten:username,
    book:req.body.bookID,
    ngay_dang:new Date(),
    noi_dung:content,
    }
)
await comment.save()

res.redirect("back");
})

// exports.checkFavourite=asyncHandler(async(req,res,next)=>
// {
//   res.locals.user = req.session.user;

//   var user=req.session.user;
//   var is = true

//   var check = await favouriteModel.find({uid:user.id},{isbn:book})
//   if (check=={}){
//     is=false
//   }
// res.redirect("back");
// });

exports.addFavourite=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  res.locals.user = req.session.user;
  const id=req.query.id
  const user=req.session.user

  var check = await bookModel.findOne({isbn:id})

  let favourite=new favouriteModel(
    {
    uid:user.id,
    isbn:check.isbn,
    }
)
console.log(favourite)
await favourite.save()

res.redirect("back");
});

exports.removeFavourite=asyncHandler(async(req,res,next)=>
{
  if(!req.session.user) res.redirect('/');
  res.locals.user = req.session.user;
  const id=req.query.id
  const user=req.session.user
  var check = await bookModel.findOne({_id:id})

  query = {uid:user.id,isbn:check.isbn}
  console.log(query)


await  favouriteModel.deleteOne(query);

res.redirect("back");
});