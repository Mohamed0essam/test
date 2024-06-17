// read and return today tasks, daily hours
// Task CRUD

const Task = require('../models/task.model')
const Group = require('../models/group.model')
const groupServices = require('./group.services')


// Create a single task in a group.
const createTask = async(userID, {groupID, taskName, taskDesc, startDate, endDate, attachedFiles}) => 
{
    console.log("ID: "+groupID)
    try 
    {
        const tempTask = new Task
        (
            {
                assigner: userID,
                group: groupID, 
                name:taskName, 
                taskDesc, 
                 
                startDate, 
                endDate, 
                 
                attachedFiles
            }
        )
        const newTask = await tempTask.save() 
        return newTask
    } 
    catch (err) 
    {
        console.log('Create task error: ' + err)
    }
}



// Read all tasks in DB. Testing only.
const readAllTasks = async() => 
{
    try 
    {
        const tasks = await Task.find({})
        return tasks
    } 
    catch (err) 
    {
        console.log('Read all tasks error: ' + err)
    }
}



// Read a task using its unique ID.
const readTask = async(taskID) => 
{
    try 
    {
        const task = await Task.findById(taskID)
        return task
    } 
    catch (err) 
    {
        console.log('Read task error: ' + err)
    }
}



// Read the tasks of a single group.
const readGroupTasks = async(groupID) =>
{
    try
    {
        const groupTasksId = await Group.findById(groupID, {_id:0, tasks: 1})
        const tasks = await Task.find({_id: { $in: groupTasksId.tasks }}, {name:1, status:1, attachedFiles:1, whoCompletedTask:1})
        let temp = []
        const completeTasks = []
        const incompleteTasks = []
        for (let task in tasks)
        {
            temp = task.whoCompletedTask || []
            if (temp.length > 0)
                completeTasks.push(tasks[task])
            else
                incompleteTasks.push(tasks[task])
        }
        return {completeTasks, incompleteTasks}
    }
    catch (err)
    {
        console.log('Read group tasks error: ' + err)
    }
}



// Read all tasks from the groups of the user whose deadlines are today.
const readTodayTasks = async(userID) =>
{
    try
    {
        const userGroups = await Group.find({joinedUsers: userID})
        console.log(userGroups)
        return userGroups
    }
    catch (err)
    {
        console.log("Read today tasks error" + err)
    }
}


// Update a task in a group using the task's unique ID.
const updateTask = async(taskID, updates) => 
{
    try 
    {
        const task = await Task.findByIdAndUpdate
        (
            taskID, 
            {
                name: updates.taskName,
                description: updates.taskDesc,
                startDate: updates.startDate,
                endDate: updates.endDate,
                attachedFiles: updates.attachedFiles
            }
        )
        const updatedTask = await Task.findById(taskID)     // Can use readTask() instead
        return updatedTask
    } 
    catch (err) 
    {
        console.log('Update task error: ' + err)
    }
}



// Delete a single task from a group using the task's unique ID.
const deleteTask = async (taskID) => 
{
    try 
    {
        const deleteCount = await Task.findByIdAndDelete(taskID)
        return deleteCount
    } 
    catch (err) 
    {
        console.log('Delete task error: ' + err)
    }
}



// Search through tasks within a group.
const searchTasks = async() => 
{
    try 
    {

    } 
    catch (err) 
    {
        console.log('search task error: ' + err)
    }
}



// Exporting this file's modules to use them elsewhere.
module.exports = 
{
    createTask,
    readAllTasks,
    readTask,
    readGroupTasks,
    readTodayTasks,
    updateTask,
    deleteTask,
    searchTasks
}