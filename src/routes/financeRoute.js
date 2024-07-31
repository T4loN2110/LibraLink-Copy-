const express = require('express');
const router = express.Router();

const financeController=require('../controllers/financeController');

router.get('/create',financeController.getCreateInvoice);
router.post('/create',financeController.createInvoice);
router.post('/delete',financeController.deleteInvoice);
router.post('/filterAllInvoice',financeController.filterAllInvoice);
router.post('/filterFinanceInvoice',financeController.filterFinanceInvoice);
router.post('/deleteAdminInvoice',financeController.deleteAdminInvoice);
router.get('/:page',financeController.getAllInvoice);
router.get('/detail/:page',financeController.getFinancePage);

module.exports = router;
