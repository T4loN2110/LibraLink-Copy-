const express = require('express');
const router = express.Router();

const notificationController=require('../controllers/notificationController');

router.get('/notifs',notificationController.showNotifications);
router.get('/getNotiDetail',notificationController.getNotification);

module.exports = router;