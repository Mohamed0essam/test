const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controller')
const authnMidlleware  = require ('../middlewares/authentication.middle')


// Create post
router.route('/create').post(authnMidlleware.checkSession, postController.createPost)


// Read post
router.route('/read-all/').get(authnMidlleware.checkSession, postController.readAllPosts)
router.route('/read/:_id').get(authnMidlleware.checkSession, postController.readPost)


// Update post
router.route('/update/:_id').patch(authnMidlleware.checkSession, postController.updatePost)


// Delete post
router.route('/delete/:_id').delete(authnMidlleware.checkSession, postController.deletePost)


// Search post
router.route('/search').get(authnMidlleware.checkSession, postController.searchPosts)


module.exports = router