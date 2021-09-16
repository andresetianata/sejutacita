const express = require('express');
var router = express.Router();
var User = require('../models/User');
var Login = require('../models/Login');

router.get('/user/read_all', User.api_read_users_all);
router.post('/user/insert', User.api_insert_user)
router.get('/user/read/:id', User.api_read_user_by_id)
router.post('/user/update', User.api_update_user)
router.post('/user/delete', User.api_delete_user)

router.post('/login', Login.api_user_login);
module.exports = router;