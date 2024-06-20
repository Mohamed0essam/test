const express = require('express');
const router = express.Router();
const AuthMiddle = require('../middlewares/authentication.middle');
const userController = require('../controllers/user.controller')

//router.route('/').get();


// need to create userCountroller

// update user data 
router.route('/update-user').patch(AuthMiddle.checkSession, userController.updateUserData);
router.route('/update-key').patch(AuthMiddle.checkSession, userController.updateUserKey)
router.route('/update-user-password').patch();
router.route('/follow/:_id').patch(AuthMiddle.checkSession, userController.followUser);
router.route('/unfollow/:_id').patch(AuthMiddle.checkSession, userController.unfollowUser);
router.route('/remove-follower/:_id').patch(AuthMiddle.checkSession, userController.removeFollower);

// get single user data as followers 
router.route('/show-me').get();
router.route('/profile/:_id').get(AuthMiddle.checkSession, userController.readUserProfile);
router.route('/read-followers').get(AuthMiddle.checkSession, userController.readFollowers);
router.route('/read-follows').get(AuthMiddle.checkSession, userController.readFollows);
router.route('/friends').get(AuthMiddle.checkSession, userController.readFriends);
router.route('/search').post(AuthMiddle.checkSession, userController.searchUsers);



module.exports = router;