
const Group = require('../models/group.model')
const User = require('../models/user.model')
const taskServices = require('../services/task.services')


// Create group
const  createGroup = async(userID, {name, description, startAt, deadline, privacy, groupPhoto, filteredFiles, filteredCategories}) => 
{
    try 
    {
        console.log(userID)
        const group = new Group
        (
            {
                name: name,
                owner: userID, 
                description: description, 
                startAt: startAt, 
                endDate: deadline, 
                privacy: privacy, 
                groupPhoto: groupPhoto, 
                attachedFiles: filteredFiles, 
                categories: filteredCategories,
                joinedUsers: userID
            }
        ) // Add the creator of the group to joined users list
        const newGroup = await group.save()

        // const groupAfterUserAddition = await Group.findById(newGroup._id, {$push: {joinedUsers: userID}})
        const created = await User.findByIdAndUpdate(userID, {$push: {createdTodoLists: newGroup._id}})

        if (!created)
            return null

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
        const groups = await Group.deleteMany({})
        return groups //
    } 
    catch(err) 
    {
        console.log('Read all group error: ' + err)
    }
}

// Read group
const readGroup = async(groupID, userID) => 
{
    try 
    {
        let participants = 0
        const joinedParticipants = await Group.findById(groupID, {joinedUsers:1})
        const group = await Group.findById(groupID, {owner:1, name:1, groupPhoto:1, privacy:1, description:1, createdAt:1, endDate:1, attachedFiles:1, categories: 1})
        const owner = await User.findById(group.owner, {firstName:1, lastName:1})
        const tasks = await taskServices.readGroupTasks(groupID, userID)
        for (let user in joinedParticipants.joinedUsers)
            participants += 1
        return {owner, group, participants, tasks}
    } 
    catch (err) 
    {
        console.log('Read group error: ' + err)
    }
}

const readUserGroups = async(userID, owner) => 
{
    try 
    {
        let groups
        if (owner == true)
            groups = await Group.find({joinedUsers : userID}, {name: 1, groupPhoto: 1, privacy:1 })
        else
            groups = await Group.find({joinedUsers : userID, privacy: "public"}, {name: 1, groupPhoto: 1, privacy:1 })
        if (!groups)
            return false
        return groups
    }
    catch (err)
    {
        console.log('Read user groups error: ' + err)
    }
}


const readGroupParticipants = async(groupID) =>
{
    // Does not require identity checks excpet for anonymous users which should not be able to access any data from the system.
    try
    {
        const group = await Group.findById(groupID, {joinedUsers:1})
        if(!group) return null

        const participants = await User.find({_id:{$in: group.joinedUsers}}, {firstName:1, lastName:1, firebaseID:1, profilePhoto:1})
        return participants.reverse()
    }
    catch (err)
    {
        console.log("Read group participants error: " + err)
    }
}

// Update group
const updateGroup = async(groupID, {name, description, groupPhoto, endDate, filteredFiles, privacy, filteredCategories}) => 
{
    try 
    {
        const group = await Group.findByIdAndUpdate
        (
            groupID, 
            {
                name: name, 
                description: description, 
                groupPhoto: groupPhoto, 
                endDate: endDate, 
                attachedFiles: filteredFiles, 
                privacy: privacy, 
                categories: filteredCategories
            }
        )
        const updatedGroup = readGroup(groupID)
        return updatedGroup
    } 
    catch (err) 
    {
        console.log('Update group error: ' + err)
    }
}


const joinGroup = async(userID, groupID) =>
{
    try
    {
        let group = await Group.find({_id:groupID, joinedUsers:{$in:userID}}, {name:1})
        if (group == "")
        {
            group = await Group.findById(groupID, {privacy:1})
            if (group.privacy === "private")
                return false
            const result = await Group.findByIdAndUpdate(groupID, {$push: {joinedUsers: userID}})
            result.save()
            if(!result)
                return false
            return true
        }
        return false
    }
    catch (err)
    {
        console.log("Join group error: " + err)
    }
}


// To leave a group
const leaveGroup = async(userID, groupID) =>
{
    const group = await Group.findById(groupID, {_id: 0, name: 1, joinedUsers: 1, owner: 1})
    
    if (!group == "")
    {
        if (userID == group.owner)
            return false
        else if (group.joinedUsers.includes(userID))
        {
            const result = await Group.findByIdAndUpdate(groupID, {$pull: {joinedUsers: userID}})
            if (!result)
                return false
            return true
        }
    }
    return false
}


// Allows admin to remove participants
const removeParticipant = async(userID, participantID, groupID) => 
{
    try
    {
        let group = await Group.find({_id: groupID, joinedUsers: {$in: participantID}}, {name:1}) 
        console.log("Group: " + group)
        if (group == "")
            return null

        if (userID === participantID)
            return null
        
        group = await Group.findByIdAndUpdate(groupID, {$pull: {joinedUsers: participantID}})
        return group       
    }
    catch (err)
    {
        console.log("Remove participant error: " + err)
    }
}



// Delete group
const deleteGroup = async(groupID, userID) => 
{
    try 
    {
        const deleteCount = await Group.findByIdAndDelete(groupID)
        // const deleteCount = 1
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
    readGroupParticipants,
    updateGroup,
    joinGroup,
    leaveGroup,
    removeParticipant,
    deleteGroup,
    searchUserGroups,
    searchGroups
}
