const departmentModel=require('../models/departmentModel');
const asyncHandler = require("express-async-handler");
const ObjectID = require('mongodb').ObjectId;

exports.getAddDepartmentPage=(req,res,next)=>
{
    res.render('tmetmoiqua');
}
exports.addDepartment=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    let dep=new departmentModel(
    {
        sdt:req.body.sdt,
        dia_chi:req.body.dia_chi,
    }
    )
    console.log(dep);
    var check=await departmentModel.findOne({sdt:dep.sdt,dia_chi:dep.dia_chi})
    
    if(check)
    {
        return res.send("Bruh")
    }
    await dep.save()
    res.redirect('/department/create');
})