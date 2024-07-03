const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controller')
const authnMidlleware  = require ('../middlewares/authentication.middle')


// Create post
router.route('/create').post(authnMidlleware.checkSession, postController.createPost)


// Read post
router.route('/read-all/').get(postController.readAllPosts)
router.route('/read/:_id').get(authnMidlleware.checkSession, postController.readPost)


// Update post
router.route('/update/:_id').patch(authnMidlleware.checkSession, postController.updatePost)
router.route('/like-post').patch(authnMidlleware.checkSession, postController.likePost)
router.route('/unlike-post').patch(authnMidlleware.checkSession, postController.unlikePost)


// Delete post
// router.route('/delete/:_id').delete(authnMidlleware.checkSession, postController.deletePost)
router.route('/delete/:_id').delete(postController.deletePost)


// Search post
router.route('/search').get(authnMidlleware.checkSession, postController.searchPosts)

// recommended posts

router.route('/recommended-posts').get(authnMidlleware.checkSession, postController.getRecommendedPosts)
router.route('/recommended-poststest/').get(postController.getRecommendedPosts)

module.exports = router