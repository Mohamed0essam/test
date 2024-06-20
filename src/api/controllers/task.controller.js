const Task = require('../models/task.model')
const taskServices = require('../services/task.services')
const groupServices = require('../services/group.services')


// Create task
const createTask = async(req, res) => 
{
    const userID = req.user.id
    const {groupID, taskName, taskDesc, isHabit, startDate, endDate, attachedFiles} = req.body
    const newTask = await taskServices.createTask(userID, groupID, taskName, taskDesc, isHabit, startDate, endDate, attachedFiles)
    if (!newTask) 
        return res.status(400).json("Invalid data").end()
    await groupServices.updateGroup(groupID, {$push: {tasks: newTask._id}})
    return res.status(200).json({msg: "Task created successfully", task: newTask}).end()
}


// Read task
const readAllTasks = async(req, res) => 
{
    const tasks = await taskServices.readAllTasks()
    if (!tasks) 
        return res.status(400).json('Could not fetch all tasks').end()
    
    return res.status(200).json(tasks).end()
}

const readTask = async(req, res) => 
{
    const userID = req.user.id
    const taskID = req.params
    const task = await taskServices.readTask(taskID, userID)
    if (!task) 
        return res.status(404).json('No task with this ID').end()
    return res.status(200).json(task).end()
}


const readTodayTasks = async(req, res) =>
{
    const userID = req.user.id
    
    const todayTasks = await taskServices.readTodayTasks(userID)
    if (!todayTasks)
        return res.status(400).json('Failed to get today\'s tasks').end()
    return res.status(200).json({msg: "Tasks obtained successfully", tasks: todayTasks}).end()
}

// Update task
const updateTask = async(req, res) => 
{
    const taskID = req.params._id
    const {groupID, taskName, taskDesc, isHabit, startDate, endDate, attachedFiles} = req.body
    const updatedTask = await taskServices.updateTask(taskID, {taskName, taskDesc, isHabit, startDate, endDate, attachedFiles})
    if (!updatedTask) 
        return res.status(400).json('Invalid data').end()
    
    return res.status(201).json({msg: "Task updated successfully", task: updatedTask}).end()
}


// Mark task as done
const markTask = async(req, res) =>
{
    const userID = req.user.id
    const taskID = req.params._id
    const result = await taskServices.markTask(userID, taskID)
    if (!result)
        return res.status(400).json("Couldn't mark task as done").end()
    return res.status(200).json("Task marked done successfully").end()
}


// Delete task
const deleteTask = async(req, res) => 
{
    let taskID = req.params

    const deleteCount = await taskServices.deleteTask(taskID)
    if (deleteCount <= 0) 
        return res.status(404).json("The task could not be deleted").end()
    else if (!deleteCount)
        return res.status(404).json('No task with this ID').end()
    
    return res.status(200).json("The task has been deleted").end()
    // check user tasks
}



module.exports = 
{
    createTask,
    readAllTasks,
    readTask,
    readTodayTasks,
    updateTask,
    markTask,
    deleteTask
}