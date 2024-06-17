const express = require ('express')
const router = express.Router()
const groupController = require('./../controllers/group.controller.js')

// Craete group
router.route('/create').post(groupController.createGroup)

// Read group data
router.route('/read-all').get(groupController.readAllGroups)     // For testing purposes

router.route('/read/:_id').get(groupController.readGroup)


// Update group data 
router.route('/update/:_id').patch(groupController.updateGroup)


// Delete group
router.route('/delete/:_id').delete(groupController.deleteGroup)


// Search groups
router.route('/search').get(groupController.searchGroups)


module.exports = router