const express = require('express');
const router = express.Router();
const user = require('../controller/user_controller');

// Define routes and connect to controller methods
router.post('/login', user.login);
router.post('/logout', user.logout);
router.get('/me', user.me);
router.post('/forgetPassword', user.forgetPassword);
router.get('/resetPassword/:id/:token', user.resetPasswordWithGet);
router.post('/resetPassword', user.resetPasswordWithPost);

module.exports = router;
