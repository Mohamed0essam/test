const express = require('express');
const router = express.Router();
const AuthMiddle = require('../middlewares/authentication.middle');
const userCountroller = require('../controllers/user.controller')

//router.route('/').get();


// need to create userCountroller

// update user data 
router.route('/showMe').get();
router.route('/updateUser').patch(AuthMiddle.checkAuth, userCountroller.updateUserData);
router.route('/updateUserPassword').patch();

// get single user data as followers 
router.route('/:id').get(AuthMiddle.checkAuth,userCountroller.getUserData);


module.exports = router;