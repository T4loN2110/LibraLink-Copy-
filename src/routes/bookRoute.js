const express = require('express');
const router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/images')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage });

const bookController=require('../controllers/bookController');

router.get('/create',bookController.getAddBookPage)
router.post('/create',upload.single('anh_bia_sach'),bookController.addBook);
router.post('/process',upload.single('anh_bia_sach'),bookController.processBook);
router.get('/:page',bookController.getAllBook);
router.post('/:page',bookController.searchBook);
module.exports = router;