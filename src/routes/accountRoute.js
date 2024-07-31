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

const accountController=require('../controllers/accountController');

router.get('/personalProfile',accountController.personalProfileManagement);
router.post('/updateProfile',accountController.updateUserProfile);
router.post('/updatePassword',accountController.updatePassword);
router.post('/filterAllUser',accountController.filterAllUser)
router.get('/addEditUserPage',accountController.addEditUserPage)
router.post('/saveAddUser',accountController.saveAddUser)
router.post('/editOneUser',accountController.editOneUser)
router.post('/deleteOneUser',accountController.deleteOneUser)
router.get('/:page',accountController.allUserPage)

module.exports = router ;