const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment.controller')
const authnMidlleware  = require ('../middlewares/authentication.middle')


router.route('/create').post(authnMidlleware.checkSession, commentController.createComment)
router.route('/create-reply').post(authnMidlleware.checkSession, commentController.createReply)


module.exports = router