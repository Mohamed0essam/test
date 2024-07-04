const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment.controller')
const authnMiddleware  = require ('../middlewares/authentication.middle')


// Create
router.route('/create').post(authnMiddleware.checkSession, commentController.createComment)
router.route('/create-reply').post(authnMiddleware.checkSession, commentController.createReply)


// Delete
router.route('/delete/:_id').delete(authnMiddleware.checkSession, commentController.deleteComment)
router.route('/delete-reply/:_id').delete(authnMiddleware.checkSession, commentController.deleteReply)


module.exports = router