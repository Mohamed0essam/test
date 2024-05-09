const express = require ('express')
const router = express.Router()
const groupController = require('../controllers/group.controller')
const authnMidlleware = require('../middlewares/authentication.middle')
const authoriztion = require ('../middlewares/authoriztion.middle')

// Craete group
router.route('/create').post(authnMidlleware.checkAuth,groupController.createGroup)

// Read group data
router.route('/read-all').get(authnMidlleware.checkAuth, groupController.readAllGroups)     // For testing purposes

router.route('/read/:_id').get(authnMidlleware.checkAuth, groupController.readGroup)
    
router.route('/readUserGroups').get(authnMidlleware.checkAuth, groupController.readUserGroups)


// Update group data 
router.route('/update/:_id').patch(authnMidlleware.checkAuth, authoriztion.groupAdminCheck, groupController.updateGroup)


// Delete group
router.route('/delete/:_id').delete(authnMidlleware.checkAuth, authoriztion.groupAdminCheck, groupController.deleteGroup)


// Search groups
router.route('/search').post(authnMidlleware.checkAuth, groupController.searchGroups)
router.route('/search-user-groups').post(authnMidlleware.checkAuth, groupController.searchUserGroups)


module.exports = router