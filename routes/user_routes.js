const express = require('express');
const router = express.Router();
const user = require('../controller/user_controller');

// Define routes and connect to controller methods
router.post('/login', user.login);
router.post('/logout', user.logout);
router.get('/me', user.me);

module.exports = router;
