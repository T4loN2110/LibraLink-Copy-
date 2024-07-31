const express = require('express');
const router = express.Router();

const searchController=require('../controllers/searchController');
router.post('/byTag',searchController.searchBook1)
router.get('/:page',searchController.searchBook0)
router.post('/:page',searchController.searchBook)


module.exports = router;