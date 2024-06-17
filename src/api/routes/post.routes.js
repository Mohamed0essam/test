const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controller')
const authnMidlleware  = require ('../middlewares/authentication.middle')


// Create post
router.route('/create').post(authnMidlleware.checkAuth, postController.createPost)


// Read post
router.route('/read-all/').get(authnMidlleware.checkAuth, postController.readAllPosts)
router.route('/read/:_id').get(authnMidlleware.checkAuth, postController.readPost)


// Update post
router.route('/update/:_id').patch(authnMidlleware.checkAuth, postController.updatePost)


// Delete post
router.route('/delete/:_id').delete(authnMidlleware.checkAuth, postController.deletePost)


// Search post
router.route('/search').get(authnMidlleware.checkAuth, postController.searchPosts)


module.exports = router