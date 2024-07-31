const asyncHandler = require("express-async-handler");
const ObjectID = require('mongodb').ObjectId;

exports.librarianActivityManagement=(req,res,next)=>{
    res.locals.user = req.session.user;
    res.render('library_activities_management');
}