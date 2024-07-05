// read and return today tasks, daily hours
// Task CRUD

const Task = require('../models/task.model')
const Group = require('../models/group.model')
const { startOfDay, endOfDay } = require('date-fns');


function habitScorer(repetitions, startDate, endDate, interval)
{
    let habitScore = 1

    if (repetitions > 0)
    {
        startDate = new Date(startDate)
        endDate = new Date(endDate)

        const dayDiff = Math.floor((endDate - startDate)/(1000 * 60 * 60 * 24))
        
        if (interval === "daily")
        {
            if (dayDiff < 1)
                habitScore = repetitions
            else
                habitScore = dayDiff * repetitions
        }
        else if (interval === "weekly")
        {
            if (dayDiff < 7)
                habitScore = repetitions
            else
                habitScore = (dayDiff / 7) * repetitions
        }
        else if (interval === "monthly")
        {
            if (dayDiff < 30)
                habitScore = repetitions
            else
                habitScore = (dayDiff / 30) * repetitions
        }
        else if (interval === "yearly")
        {
            if (dayDiff < 365)
                habitScore = repetitions
            else
                habitScore = (dayDiff / 365) * repetitions
        }
    }
    // console.log(typeof(habitScore))
    return habitScore
}



// Create a single task in a group.
const createTask = async(userID, groupID, taskName, taskDesc, isHabit, startDate, endDate, filteredFiles, repetitions, interval) => 
{
    try 
    {
        let tempTask
        if (isHabit === true)
        {
            const habitScore = habitScorer(repetitions, startDate, endDate, interval)

            tempTask = new Task
            (
                {
                    assigner: userID,
                    group: groupID, 
                    name: taskName, 
                    description: taskDesc, 
                    isHabit: true,
                    startDate: startDate, 
                    endDate: endDate, 
                    attachedFiles: filteredFiles,
                    repetitions: repetitions,
                    interval: interval,
                    habitScore: habitScore
                }
            )
        }
        else
        {
            tempTask = new Task
            (
                {
                    assigner: userID,
                    group: groupID, 
                    name: taskName, 
                    description: taskDesc, 
                    isHabit: false,
                    startDate: startDate, 
                    endDate: endDate, 
                    attachedFiles: filteredFiles,
                }
            )
        }

        const newTask = await tempTask.save() 
        if (newTask)
            await Group.findByIdAndUpdate(groupID, {$push: {tasks: newTask._id}})
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
        start.setHours(3, 0, 0, 0)
        const end = endOfDay(new Date())
        end.setHours(2,59,59,999)
        let idArr = []
        

        const todayTasks = await Task.find({group: {$in: userGroups}, endDate: {$gte: start, $lte:end}}, {_id:1, userCompleted:1, group:1})
        
        for (let task of todayTasks)
        {
            idArr.push(task)
        }

        let groupPictures = []
        let groupPic
        for (let taskID of todayTasks)
        {
            groupPic = await Group.findOne(taskID.group, {_id: 0, groupPhoto: 1})
            groupPictures.push(groupPic)
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
const updateTask = async(userID, groupID, taskID, updates) => 
{
    try 
    {
        let task = await Task.findById(taskID)

        if (task.group != groupID || task.assigner != userID || !task)
            return false

        if (updates.isHabit === true)
        {
            const habitScore = habitScorer(updates.repetitions, updates.startDate, updates.endDate, updates.interval)
            
            task = await Task.findByIdAndUpdate
            (
                taskID,
                { 
                    name: updates.taskName, 
                    description: updates.taskDesc,
                    startDate: updates.startDate, 
                    endDate: updates.endDate, 
                    isHabit: true,
                    attachedFiles: updates.filteredFiles,
                    repetitions: updates.repetitions,
                    interval: updates.interval,
                    habitScore: habitScore
                }
            )
        }
        else
        {
            task = await Task.findByIdAndUpdate
            (
                taskID, 
                {
                    name: updates.taskName, 
                    description: updates.taskDesc,
                    startDate: updates.startDate, 
                    endDate: updates.endDate, 
                    isHabit: false,
                    attachedFiles: updates.filteredFiles,
                }
            )
        }
        const updatedTask = await Task.findById(taskID)     // Can use readTask() instead
        console.log(updatedTask)
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