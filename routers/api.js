const express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/user/read_all', User.api_read_users_all);
router.post('/user/insert', User.api_insert_user)

module.exports = router;