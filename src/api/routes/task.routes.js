const express = require('express')
const router = express.Router()
const taskController = require( '../controllers/task.controller')
const authnMidlleware = require('../middlewares/authentication.middle')
const authoriztion = require ('../middlewares/authoriztion.middle')


// Create task
// router.route('/create').post(authnMidlleware.checkAuth, authoriztion.groupAdminCheck ,taskController.createTask)
router.route('/create').post(authnMidlleware.checkSession, authoriztion.groupAdminCheck ,taskController.createTask)


// Read task
router.route('/read-all').get( taskController.readAllTasks)  //Testing only
router.route('/read/:_id').post(authnMidlleware.checkSession, authoriztion.groupParticipantCheck, taskController.readTask)
router.route('/read-today-tasks').get(authnMidlleware.checkSession,  taskController.readTodayTasks)


// Update task
router.route('/update/:_id').patch(authnMidlleware.checkSession, authoriztion.groupAdminCheck, taskController.updateTask)
router.route('/mark-task/:_id').patch(authnMidlleware.checkSession, taskController.markTask)
//update bulk data.

// Delete task
router.route('/delete/:_id').delete(authnMidlleware.checkSession, authoriztion.groupAdminCheck, taskController.deleteTask)


// Search tasks
// router.route('/search').get(authnMidlleware.checkAuth, authoriztion.groupAdminCheck, taskController.searchTasks)


module.exports = router