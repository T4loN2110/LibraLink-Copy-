const express = require('express');
const router = express.Router();

const borrowController=require('../controllers/borrowController');


router.get('/',borrowController.getBookInfo);
router.post('/',borrowController.createBorrowRequest);
router.get('/allRequest/:page',borrowController.getAllBorrowRequest);
router.get('/selfRequest/:page',borrowController.getUserBorrowRequest);
router.post('/allRequest/:page',borrowController.searchAllRequest);
router.post('/selfRequest/:page',borrowController.searchUserRequest);
router.get('/confirm',borrowController.confirmRequest);
router.get('/confirm_return',borrowController.confirmReturnRequest);//deo hieu s no k hoat dong nen t phai lam cai culon nay
router.get('/confirm_extend',borrowController.confirmExtendRequest);
router.get('/reject',borrowController.rejectRequest);
router.get('/reject_extend',borrowController.rejectExtendRequest);
router.get('/extend',borrowController.extendRequest);

module.exports = router;