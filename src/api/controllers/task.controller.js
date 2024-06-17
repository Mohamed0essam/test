const Task = require('../models/task.model')
const taskServices = require('../services/task.services')
const groupServices = require('../services/group.services')


// Create task
const createTask = async(req, res) => 
{
    const userID = req.user.id
    const {groupID, taskName, taskDesc, startDate, endDate, attachedFiles} = req.body
    const newTask = await taskServices.createTask(userID, {groupID, taskName, taskDesc, startDate, endDate, attachedFiles})
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
    const taskID = req.params
    const task = await taskServices.readTask(taskID)
    if (!task) 
        return res.status(404).json('No task with this ID').end()
    return res.status(200).json(task).end()
}


const readTodayTasks = async(req, res) =>
{
    const userID = req.user.id
    console.log(userID)
    const todayTasks = await taskServices.readTodayTasks(userID)
    if (!todayTasks)
        return res.status(400).json('Failed to get today\'s tasks').end()
    return res.status(200).json({msg: "Tasks obtained successfully", tasks: todayTasks}).end()
}

// Update task
const updateTask = async(req, res) => 
{
    const taskID = req.params
    const {taskName, taskDesc, startDate, endDate, attachedFiles} = req.body
    const updatedTask = await taskServices.updateTask(taskID, {taskName, taskDesc, startDate, endDate, attachedFiles})
    if (!updatedTask) 
        return res.status(400).json('Invalid data').end()
    
    return res.status(201).json({msg: "Task updated successfully", task: updatedTask}).end()
}


// Delete task
const deleteTask = async(req, res) => 
{
    let taskID = req.params
    const task = await taskServices.readTask(taskID)
    if (!task)
        return res.status(404).josn('No task with this ID').end()
    
    const groupID = task.group
    taskID = task._id
    const deleteCount = await taskServices.deleteTask(taskID)
    if (deleteCount <= 0) 
        return res.status(404).json("The task could not be deleted").end()
    
    await groupServices.updateGroup(groupID, {$pull: {tasks: taskID}})
    return res.status(200).json("The task has been deleted").end()
    // check user tasks
}


// Search tasks
const  searchTasks = async (req, res) => 
{

}


module.exports = 
{
    createTask,
    readAllTasks,
    readTask,
    readTodayTasks,
    updateTask,
    deleteTask,
    searchTasks
}