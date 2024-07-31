const express = require('express');
const router = express.Router();

const departmentController=require('../controllers/departmentController');

router.get('/create',departmentController.getAddDepartmentPage);
router.post('/create',departmentController.addDepartment);
module.exports = router;