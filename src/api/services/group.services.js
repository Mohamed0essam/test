
const Group = require('../models/group.model')
const taskServices = require('../services/task.services')


// Create group
const  createGroup = async({ name, owner, description, startAt, deadline, privacy, groupPhoto}) => 
{
    try 
    {
        const group = new Group({name, owner, description, startAt, deadline, privacy, groupPhoto})
        group.joinedUsers= [owner] // Add the creator of the group to joined users list
        const newGroup = await group.save()
        return newGroup
    } 
    catch (err) 
    {
        console.log('Create group error: ' + err)
    }
}

// Read all groups - Testing only without User _id, when included it will be used in Group module to display all groups of the user.
const readAllGroups = async() => 
{
    try 
    {
        const groups = await Group.find({})
        return groups
    } 
    catch(err) 
    {
        console.log('Read all group error: ' + err)
    }
}

// Read group
const readGroup = async(groupID) => 
{
    try 
    {
        const group = await Group.findById(groupID, {name:1, groupPhoto:1, privacy:1, description:1, createdAt:1, endDate:1})
        const tasks = await taskServices.readGroupTasks(groupID)
        return {group,tasks}
    } 
    catch (err) 
    {
        console.log('Read group error: ' + err)
    }
}

const readUserGroups = async(userID) => 
{
    try 
    {
        const groups = await Group.find({joinedUsers : userID}, {name: 1, groupPhoto: 1, privacy:1 })
        return groups
    }
    catch (err)
    {
        console.log('Read user groups error: ' + err)
    }
}

// Update group
const updateGroup = async(groupID, updates) => 
{
    try 
    {
        const group = await Group.findByIdAndUpdate(groupID, updates)
        const updatedGroup = readGroup(groupID)
        return updatedGroup
    } 
    catch (err) 
    {
        console.log('Update group error: ' + err)
    }
}

// Delete group
const deleteGroup = async(groupID) => 
{
    try 
    {
        const deleteCount = await  Group.findByIdAndDelete(groupID)
        return deleteCount
    } 
    catch (err) 
    {
        console.log('Delete group error: ' + err)
    }
}


const searchUserGroups = async(userID, name) =>
{
    try 
    {
        const foundGroups = await Group.find({
            $and: [
                {joinedUsers : userID}, {name: {$regex: new RegExp(`.*${name.trim()}.*`, 'i')}}
            ]
        }, {name: 1, groupPhoto: 1, privacy:1})
        return foundGroups
    } 
    catch (err) 
    {
        console.log('Search group error: ' + err)
    }
}


// Search group
const searchGroups = async(name) => 
{
    try 
    {
        const foundGroups = await Group.find({
            $and: [
            {name: {$regex: new RegExp(`.*${name.trim()}.*`, 'i')}}, {privacy: "public"}
            ]
        }, {name: 1, groupPhoto: 1})
        return foundGroups
    } 
    catch (err) 
    {
        console.log('Search group error: ' + err)
    }
}

module.exports = 
{
    createGroup,
    readAllGroups,
    readGroup,
    readUserGroups,
    updateGroup,
    deleteGroup,
    searchUserGroups,
    searchGroups
}
