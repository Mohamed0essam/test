const express = require ('express')
const router = express.Router()
const groupController = require('../controllers/group.controller')
const authnMidlleware = require('../middlewares/authentication.middle')
const authorization = require ('../middlewares/authoriztion.middle')

// Craete group
router.route('/create').post(authnMidlleware.checkSession,groupController.createGroup)

// Read group data
router.route('/read-all').get(authnMidlleware.checkSession, groupController.readAllGroups)     // For testing purposes
router.route('/read/:_id').get(authnMidlleware.checkSession, groupController.readGroup)
router.route('/read-user-groups').get(authnMidlleware.checkSession, groupController.readUserGroups)
router.route('/read-participants/:_id').get(authnMidlleware.checkSession, groupController.readGroupParticipants)


// Update group data 
router.route('/update/:_id').patch(authnMidlleware.checkSession, authorization.groupAdminCheck, groupController.updateGroup)
router.route('/join-group/:_id').patch(authnMidlleware.checkSession, groupController.joinGroup)
router.route('/leave-group/:_id').patch(authnMidlleware.checkSession, groupController.leaveGroup)
router.route('/remove-participant/:_id').patch(authnMidlleware.checkSession, authorization.groupAdminCheck, groupController.removeParticipant)


// Delete group
router.route('/delete/:_id').delete(authnMidlleware.checkSession, authorization.groupAdminCheck, groupController.deleteGroup)


// Search groups
router.route('/search').post(authnMidlleware.checkSession, groupController.searchGroups)
router.route('/search-user-groups').post(authnMidlleware.checkSession, groupController.searchUserGroups)


module.exports = router