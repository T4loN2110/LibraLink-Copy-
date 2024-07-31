const bookModel=require('../models/bookModel');
const genreModel=require('../models/genreModel');
const departmentModel=require('../models/departmentModel')
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const ObjectID = require('mongodb').ObjectId;

exports.getAddBookPage = asyncHandler(async (req, res, next) => {
    if (!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;

    const departments = await departmentModel.find();
    const genres = await genreModel.find();

    // Check if there is a book ID in the query parameters
    if (req.query.id) {
        const book = await bookModel.findById(req.query.id);
        if (!book) {
            // Handle the case where the book with the specified ID doesn't exist
            return res.redirect('/book/manage');
        }

        res.render('edit_book', { book, departments, genres });
    } else {
        // If no book ID is provided, render an empty form
        const book = new bookModel();
        res.render('edit_book', { book, departments, genres });
    }
});

exports.addBook=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        data:Buffer.from(encode_img,'base64'),
        contentType:req.file.mimetype,
    };
    const type=req.body.type;
    var book=new bookModel()
    console.log(book);
    book={
        isbn: req.body.isbn,
        ten:req.body.ten_sach,
        nam_xb:req.body.nam_xb_sach,
        the_loai:req.body.genre,
        tac_gia:req.body.tac_gia_sach,
        tom_tat:req.body.tom_tat_sach,
        gia_bia:req.body.gia_bia_sach,
        anh_bia:final_img,
        co_so:req.body.detail
    }
    console.log(book);
    await book.save()
    res.contentType(final_img.contentType);
    res.redirect("/book/1");
})

exports.getAllBook=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;
    let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 

    let query_1;
    query_1 = req.session.filter_query;
    req.session.filter_query = {};

    let query_2;
    query_2 = req.session.filter_query2;
    req.session.filter_query2 = {};

    let query = {};
	query = {...query_1, ...query_2};

    var book = await bookModel.find((query)).skip((perPage * page) - perPage).limit(perPage)
    var genres = await genreModel.find();
    var departments=await departmentModel.find();
    const count = await bookModel.countDocuments(query)
    

        res.render('book_management', {
        book, // sản phẩm trên một page
        genres,
        departments,
        errMes:"",
        current: page, // page hiện tại
        pages: Math.ceil(count / perPage) // tổng số các page

    });
})
exports.processBook=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    var final_img
    if(req.file)
    {
        var img=fs.readFileSync(req.file.path);
        var encode_img = img.toString('base64');
        final_img = {
        data:Buffer.from(encode_img,'base64'),
        contentType:req.file.mimetype,
        };
    }
    

    const id=req.body.id;
    
    var newBook
    if(id=="no")
    {newBook=new bookModel({
        isbn: req.body.isbn,
        ten:req.body.ten,
        nam_xb:req.body.nam_xb,
        the_loai:JSON.parse(req.body.the_loai),
        tac_gia:req.body.tac_gia,
        tom_tat:req.body.tom_tat,
        gia_bia:req.body.gia_bia,
        co_so:JSON.parse(req.body.co_so)
    })
    if(req.file) newBook.anh_bia=final_img,
    await newBook.save()
    }
    else{
        if(req.file)
        {
            bookModel.updateOne({_id:id},
                {isbn: req.body.isbn,
                ten:req.body.ten_sach,
                nam_xb:req.body.nam_xb,
                the_loai:req.body.the_loai,
                tac_gia:req.body.tac_gia,
                tom_tat:req.body.tom_tat,
                gia_bia:req.body.gia_bia,
                anh_bia:final_img,
                co_so:req.body.co_so
            })
        }
        else{
            bookModel.updateOne({_id:id},
                {isbn: req.body.isbn,
                ten:req.body.ten_sach,
                nam_xb:req.body.nam_xb,
                the_loai:req.body.the_loai,
                tac_gia:req.body.tac_gia,
                tom_tat:req.body.tom_tat,
                gia_bia:req.body.gia_bia,
                co_so:req.body.co_so
            })
        }
    }
    res.contentType(final_img.contentType);
    res.redirect("/book/create");
});

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
    
    return res.redirect('/book/'+page)
  
}))