// read and return today tasks, daily hours
// Task CRUD

const Task = require('../models/task.model')
const Group = require('../models/group.model')
const { startOfDay, endOfDay } = require('date-fns');


// Create a single task in a group.
const createTask = async(userID, groupID, taskName, taskDesc, isHabit, startDate, endDate, attachedFiles, repetitions, interval, intervalCycle) => 
{
    console.log(taskName)
    try 
    {
        const tempTask = new Task
        (
            {
                assigner: userID,
                group: groupID, 
                name:taskName, 
                description:taskDesc, 
                isHabit,
                startDate, 
                endDate, 
                attachedFiles,
                repetitions,
                interval,
                intervalCycle
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
const readTask = async(taskID, userID) => 
{
    try 
    {
        let isDone = false
        const task = await Task.findById(taskID)

        if (task.userCompleted.includes(userID))
            isDone = true
        return {task, isDone}
    } 
    catch (err) 
    {
        console.log('Read task error: ' + err)
    }
}



// Read the tasks of a single group.
const readGroupTasks = async(groupID, userID) =>
{
    try
    {
        // Get all task for this group
        const groupTaskIDs = await Group.findById(groupID, {tasks: 1})
        const tasks = await Task.find({_id: { $in: groupTaskIDs.tasks }}, {name:1, isHabit:1, attachedFiles:1, userCompleted:1})
        
        const completeTasks = []
        const incompleteTasks = []
        for (let task in tasks)
        {
            if (tasks[task].userCompleted.includes(userID))
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
        const userGroups = await Group.find({joinedUsers: userID}, {_id:1})
        
        const start = startOfDay(new Date())
        const end = endOfDay(new Date())
        let idArr = []
        

        const todayTasks = await Task.find({group: {$in: userGroups}, endDate: {$gte: start, $lte:end}}, {_id:1, userCompleted:1, group:1})
        
        for (let taskObj in todayTasks)
        {
            idArr.push(todayTasks[taskObj]._id)
        }

        let groupPictures = []
        for (id in idArr)
            {
                let groupPicture = await Group.find({tasks:idArr[id]}, {_id:0, groupPhoto:1})
                groupPictures.push(groupPicture[0].groupPhoto)
            }

        let completeTasks = []
        let incompleteTasks = []
        for (let task in todayTasks)
        {
            
            if (todayTasks[task].userCompleted[0] !== undefined)
                completeTasks.push(todayTasks[task])
            else
                incompleteTasks.push(todayTasks[task])
        }
        complete = completeTasks.length
        incomplete = incompleteTasks.length
        
        let doneDay = false
        if (complete !== 0 && incomplete === 0)
            doneDay = true

        
        return {todayTasks, groupPictures, complete, incomplete, doneDay}
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
                isHabit: updates.isHabit,
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


// Mark task as done
const markTask = async(userID, taskID) =>
{
    try
    {
        let isCompleted = await Task.find({_id: taskID, userCompleted: {$in: userID}}, {name:1})
        if (isCompleted == "")
        {
            const group = await Task.findById(taskID)
            const isParticipant = await Group.find({_id: group._id, joinedUsers: {$in: userID}})
            if (isParticipant)
            {
                isCompleted = await Task.findByIdAndUpdate(taskID, {$push: {userCompleted: userID}})
                if (isCompleted)
                    return true
            }
        }
        return false
    }
    catch (err)
    {
        console.log("Mark task error: " + err)
    }
}


// Delete a single task from a group using the task's unique ID.
const deleteTask = async (taskID) => 
{
    try 
    {
        const task = await Task.findById(taskID, {_id:1, group:1})
        if (!task)
            return false
        
        const groupID = task.group
        console.log("group id:" + task)
        const group = await Group.findByIdAndUpdate(groupID, {$pullAll: {tasks: [taskID]}})
        if (!group)
            return false

        const deleteCount = await Task.findByIdAndDelete(taskID)
        return deleteCount
    } 
    catch (err) 
    {
        console.log('Delete task error: ' + err)
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
    markTask,
    deleteTask
}