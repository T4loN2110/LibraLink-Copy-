const invoiceModel=require('../models/invoiceModel');
const asyncHandler = require("express-async-handler");
const ObjectID = require('mongodb').ObjectId;

exports.getCreateInvoice=(req,res,next)=>
{
    res.locals.user = req.session.user;
    res.render('finance_invoice');
}
exports.createInvoice=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    console.log(req.body.ngay_tao)
  let hantra = (Date(req.body.ngay_tao)+7);
    let inv=new invoiceModel({
        uid:req.body.uid,
        loai_hd:req.body.loai_hd,
        ngay_tao:req.body.ngay_tao,
        ngay_tra:null,
        han_tra:hantra,
        ghi_chu:req.body.ghi_chu,
        chitiet:req.body.chitiet,
        so_tien:req.body.so_tien
      })
      console.log(inv)
      await inv.save()
      res.redirect('../invoice/1');
});

exports.getAllInvoice=asyncHandler(async(req,res,next)=>
{
    // Check if user have logged in
	if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;
    
    // Pagination
	let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 

    // 1st filter
	let query_1;
    query_1 = req.session.filter_query;
    req.session.filter_query = {};

    let index_1;
    const types_1 = ['', '', '', '', '']
    index_1 = req.session.filter_index;
    types_1[index_1] = "selected";
    req.session.filter_index = 0;

	// 2nd filter
	let query_2;
    query_2 = req.session.filter_query2;
    req.session.filter_query2 = {};

    let index_2;
    const types_2 = ['', '', '']
    index_2 = req.session.filter_index2;
    types_2[index_2] = "selected";
    req.session.filter_index2 = 0;

	// Querying
	let query = {};
	query = {...query_1, ...query_2};

    var invoice = await invoiceModel.find(query).skip((perPage * page) - perPage).limit(perPage)
    const count = await invoiceModel.countDocuments(query)

	res.render('all_invoices_management', {
		types_1,  // 1st chosen filter
		types_2,  // 2nd chosen filter
		invoice, // sản phẩm trên một page
		current: page, // page hiện tại
		pages: Math.ceil(count / perPage) // tổng số các page
    });
})

exports.filterAllInvoice=asyncHandler(async(req,res,next)=>
{
    if(!req.session.user) res.redirect('/');
    let type_1 = req.body.inv_type;
    let type_2 = req.body.inv_stat;
	const invTypes = ['Book Ordering Invoice', 'Book Damaging Invoice', 'Late Return Invoice', 'Annual Fee Invoice'];

    let query_1 = {};
    if (type_1==0) {
        query_1 = {};
    }
    else {
        query_1 = {loai_hd: invTypes[type_1-1]};
    }

	let query_2 = {};
	if (type_2==0) {
		query_2 = {}
	}
	else if (type_2==1) { // Pending
		query_2 = {ngay_tra: null};
	}
	else if (type_2==2) { // Confirmed
		query_2 = {ngay_tra: {$ne: null}};
	}

    req.session.filter_query = query_1;
    req.session.filter_index = type_1;
    req.session.filter_query2 = query_2;
    req.session.filter_index2 = type_2;
    res.redirect('/invoice/1')
})

exports.deleteInvoice=asyncHandler(async(req,res,next)=>
{
    const id=req.query.id
    const query = { _id: id };
    await invoiceModel.deleteOne(query);
    res.redirect("../invoice/1")
})
exports.updateInvoice=asyncHandler(async(req,res,next)=>
{
    res.locals.user = req.session.user;
  
    const id=req.query.id
    const query = { _id: id };
    const date = new Date()
    const update = {ngay_tra: date}
    
    let doc = await invoiceModel.updateOne(query,update);
    req.session.inv={type:req.body.invoice_type,type2:req.body.invoice_type2}
  
    res.redirect("../invoice/1")
})

exports.getFinancePage=asyncHandler(async(req,res,next)=>
{
    // Check if user have logged in  
    if(!req.session.user) res.redirect('/');
    res.locals.user = req.session.user;

    // Pagination
    let perPage = 10; // number of items displayed in one page
    let page = req.params.page || 1;

    // Filter button
    let query;
    query = req.session.filter_query;
    req.session.filter_query = {};
    
    let index;
    const types = ["", "", "", "", ""];
    index = req.session.filter_index;
    types[index] = "selected";
    req.session.filter_index = 0;    

    // Access database
    var invoice = await invoiceModel.find(query).skip((perPage * page) - perPage).limit(perPage);
    const count = await invoiceModel.countDocuments(query);

    // Calculate the amount
    let sumFine = 0;
    let sumOrder = 0;
    for (let i=0; i < invoice.length; i++)
      if (invoice[i].loai_hd === 'Book Ordering Invoice')
        sumOrder += invoice[i].so_tien;
      else if (invoice[i].loai_hd === 'Book Damaging Invoice' || invoice[i].loai_hd === 'Late Return Invoice')
        sumFine += invoice[i].so_tien;
      
    res.render('finance_admin', {
        types, // filter được chọn
        invoice, // sản phẩm trên một page
        sumFine,
        sumOrder,
        current: page, // page hiện tại
        pages: Math.ceil(count / perPage) // tổng số các page
    });
})

exports.filterFinanceInvoice=asyncHandler(async(req,res,next)=>
{
    let type=req.body.invoice_type;
    let query = {};
    const inv_types = ['Book Ordering Invoice', 'Book Damaging Invoice', 'Late Return Invoice', 'Annual Fee Invoice'];

    if (type == 0) {
        query = {};
    }
    else {
        query = {loai_hd: inv_types[type-1]};
    }

    req.session.filter_query = query;
    req.session.filter_index = type;
    res.redirect('/invoice/detail/1')
})

exports.deleteAdminInvoice=asyncHandler(async(req,res,next)=>
{
    let invoiceID=req.body.invoice_id;
    
    await invoiceModel.findByIdAndDelete(invoiceID);

    res.redirect('/invoice/detail/1')
})