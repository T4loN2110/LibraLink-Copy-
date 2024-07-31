const bookModel=require('../models/bookModel');
const asyncHandler = require("express-async-handler");
const ObjectID = require('mongodb').ObjectId;

exports.home=asyncHandler(async(req,res,next)=>
{
    res.locals.user = req.session.user;
    //const books=await bookModel.find();
    //res.render('index',{books:books})
    let book_array = await bookModel.aggregate([{$sample:{size:6}}])

    res.render('index', {
        book : book_array
    });
});