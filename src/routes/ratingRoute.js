const express = require('express');
const router = express.Router();

const ratingController=require('../controllers/ratingController');

router.post('/create',ratingController.saveComment);
router.get('/add_favourite',ratingController.addFavourite);
router.get('/remove_favourite',ratingController.removeFavourite);
router.get('/add_favourite',ratingController.addFavourite);
router.get('/favourite/:page',ratingController.showFavorites)
module.exports = router;