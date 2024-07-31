
var auth = require('../utils/auth-helper');
const ObjectID = require('mongodb').ObjectId;
const asyncHandler = require("express-async-handler");
const userModel=require('../models/userModel');
// const departmentModel=require('../models/departmentModel');
// const fs = require("fs");
var { query } = require('express');

exports.personalProfileManagement=asyncHandler(async(req,res,next)=>{
    res.locals.user = req.session.user;
    query = {username:req.session.user.username}


  var acc = await userModel.findOne(query)

        res.render('personal_profile', {acc:acc});
}
)

exports.updateUserProfile=asyncHandler(async(req,res,next)=>{
    res.locals.user = req.session.user;
    query = {username:req.session.user.username}
    var us = await userModel.findOne(query)
    us.username = req.body.inputUsername
    us.name = req.body.inputName
    us.gender = req.body.inputGender
    us.phone = req.body.inputPhone
    us.address = req.body.inputAddress

    await us.save()

    res.render('personal_profile', {acc:us});
}
)

exports.updatePassword=asyncHandler(async(req,res,next)=>{
    res.locals.user = req.session.user;
    query = {username:req.session.user.username}
    var us = await userModel.findOne(query)
    
    correctPassword = await auth.comparePassword(req.body.password, us.password)
    if(!correctPassword) {
        return res.send({errMes: "Incorrect password!"});
    }
    newPassword = await auth.hashPassword(req.body.newPassword)   
    await userModel.updateOne({username:us.username},{password:newPassword})
}
)

exports.allUserPage=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;
    let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;

    let query={};
    query = req.session.filter_query;
    req.session.filter_query = {};
    let index;
    const types = ["", "", "", ""];
    index = req.session.filter_index;
    types[index] = "selected";
    req.session.filter_index = 0;    
    var user
    var count=0
    username=query.username
    if(!query.username||!query.role)
    {
        user = await userModel.find().skip((perPage * page) - perPage).limit(perPage);
        count = await userModel.countDocuments();
    }
    else if(!query.username)
    {
        user = await userModel.find({role:query.role}).skip((perPage * page) - perPage).limit(perPage);
        count = await userModel.countDocuments({role:query.role});
    }
    else if(!query.role)
    {
        user = await userModel.find({username:new RegExp('^.*'+query.username+'.*$','i')}).skip((perPage * page) - perPage).limit(perPage);
        count = await userModel.countDocuments({username:new RegExp('^.*'+query.username+'.*$','i')});
    }
    else{
        user = await userModel.find({role:query.role,username:new RegExp('^.*'+query.username+'.*$','i')}).skip((perPage * page) - perPage).limit(perPage);
        count = await userModel.countDocuments({role:query.role,username:new RegExp('^.*'+query.username+'.*$','i')});
    }

    res.render('all_users_admin', {
        username,
        types, // filter được chọn
        user, // sản phẩm trên một page
        current: page, // page hiện tại
        pages: Math.ceil(count / perPage) // tổng số các page
    });
})

exports.filterAllUser=asyncHandler(async(req,res,next)=>
{
    var type=req.body.user_type;
    const username=req.body.username
    let query = {};
    if(type==0)
    {
        if(username=="")
        {
            query = {};
        }
        else
        {
            query={username:username}
        }
    }
    else{
        if(username=="")
        {
            query={role:type}
        }
        else
        {
            query={role:type,username:username}
        }
    }
    req.session.filter_query = query;
    req.session.filter_index = type;
    res.redirect('/account/1')
})

exports.addEditUserPage=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;

    const userInput = {
        role: 0,
        username: '',
        password: '',
        name: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
    };

    res.render('add_user_admin', {userInput});
})

exports.saveAddUser=asyncHandler(async(req,res,next)=>
{
    const data = req.body.data;
    const action = req.body.action;

    console.log(data);
    
    // Save user
    if (action === 'save') {
        const result = await userModel.updateOne({username: data.username}, data);
        if (result.matchedCount > 0)
            return res.send({message: "User updated successfully"});
        return res.send({message: "Username not found!"})
    }
    
    // Add user
    if (action === 'add') {
        const result = await userModel.exists({username: data.username});
        if (result !== null)
            return res.send({message: "Username already exists"})

        let user = new userModel(data);
        await user.save();
        return res.send({message: "User added successfully"})
    }

    // Send a response
    res.send({message: "No changes were made"});
})

exports.editOneUser=asyncHandler(async(req,res,next)=>
{
    // Check if user has logged in
    if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;
    
    // Querying
    let userID = req.body.user_id;
    const userInput = await userModel.findById(userID);

    console.log(userInput);

    res.render('add_user_admin', {userInput});
})

exports.deleteOneUser=asyncHandler(async(req,res,next)=>
{
    let userID = req.body.user_id;
    
    await userModel.findByIdAndDelete(userID);

    res.redirect('/account/1')
})