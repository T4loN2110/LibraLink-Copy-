const express = require('express');
const router = express.Router();

const activityController=require('../controllers/activityController');

router.get('/manageActivity',activityController.librarianActivityManagement);

module.exports = router;