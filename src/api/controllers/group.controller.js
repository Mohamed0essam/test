// CRUD Operations
// Status codes will be changed to appropriate ones
// Will encrypt all parameters and tokens

const Group = require('../models/group.model')
const groupServices = require('../services/group.services')
const userServices = require('../services/user.servies')
const validation = require('../middlewares/userValidations.middleware')


// Create group
const  createGroup = async (req, res) => 
{
    const userID = req.user.id
    const {name, description, startDate, endDate, privacy, groupPhoto, attachedFiles} = req.body;
    const categories = req.body.categories

    let filteredCategories
    if (categories)
    {
        const preFilteredCategories = categories.filter(item => {
            // Convert item to boolean and check if it's truthy
            return item && typeof item === 'string' && item.trim() !== '';
        })

        filteredCategories = [...new Set(preFilteredCategories)];
    }

    console.log(categories)

    let filteredFiles
    if (attachedFiles)
    {
        filteredFiles = attachedFiles.filter(item => {
            // Convert item to boolean and check if it's truthy
            return item && typeof item === 'string' && item.trim() !== '';
        })
    }

    const newGroup = await groupServices.createGroup(userID, {name, description, startDate, endDate, privacy, groupPhoto, filteredFiles, filteredCategories});
    if (!newGroup)
        return res.status(400).json("Invalid data").end()
    
    return res.status(200).json( { message: "Group created successfuly", group: newGroup }).end()
}

// Read all groups
const readAllGroups = async(req, res) => 
{
    const groups = await groupServices.readAllGroups();
    if (!groups)
        return res.status(400).json( "Error while fetching the data" ).end()
        
    return res.status(200).json(groups).end()
}

// Read single group
const readGroup = async(req, res) => 
{
    const groupID = req.params
    const userID = req.user.id
    const group = await groupServices.readGroup(groupID, userID)
    const status = await validation.userRole(userID, groupID)
    if (!group)
        return res.status(400).json( "No such group" ).end()
        
    if (status === 200)
        return res.status(200).json({msg: "Group found successfully", group: group}).end()
    else if (status === 201)
        return res.status(201).json({msg: "Group found successfully", group: group}).end()
    else if (status === 202)
        return res.status(202).json({msg: "Group found successfully", group: group}).end()
    else
        return res.status(404).json("Page not found")
}

// Read user groups
const readUserGroups = async(req, res) =>
{
    const userID = req.user.id
    const groups = await groupServices.readUserGroups(userID, true)
    if (!groups)
        return res.status(400).json("User has no groups").end()
    return res.status(200).json({msg:'Groups found', groups : groups}).end()
}


// Read group participants
const readGroupParticipants = async(req, res) =>
{
    const groupID = req.params
    const participants = await groupServices.readGroupParticipants(groupID)
    if (!participants)
        return res.status(400).json("Couldn't fetch participants list").end()
    return res.status(200).json({msg: "Participants list fetched successfully", participants: participants}).end()
}


// Update group
const updateGroup = async(req, res) => 
{
    const groupID = req.params
    const {name, description, groupPhoto, endDate, attachedFiles, privacy, categories} = req.body
    let filteredCategories = "", filteredFiles = ""
    
    if (categories)
    {
        filteredCategories = categories.filter(item => 
        {
            // Convert item to boolean and check if it's truthy
            return item && typeof item === 'string' && item.trim() !== '';
        });
    }

    if (attachedFiles)
    {
        filteredFiles = attachedFiles.filter(item => 
        {
            // Convert item to boolean and check if it's truthy
            return item && typeof item === 'string' && item.trim() !== '';
        });
    }

    const updatedGroup = await  groupServices.updateGroup(groupID , {name, description, groupPhoto, endDate, filteredFiles, privacy, filteredCategories})
    if (!updatedGroup)
        return res.status(400).json("No such group").end()
        
    return res.status(200).json({msg : "Group updated successfully", group: updatedGroup})
}


// Allows the user to join a group
const joinGroup = async(req, res) => 
{
    const userID = req.user.id
    const groupID = req.params
    const isJoined = await groupServices.joinGroup(userID, groupID)
    console.log("joined: "+ isJoined)
    if (isJoined === false)
        return res.status(404).json('Page not found').end()
    return res.status(200).json('Group joined successfully').end()
}


// Leave group
const leaveGroup = async(req, res) =>
{
    userID = req.user.id
    groupID = req.params
    const result = await groupServices.leaveGroup(userID, groupID)
    if (result === false)
        return res.status(400).json('Page not found').end()
    return res.status(200).json('Left group successfully').end()
}


// Remove participnat from group
const removeParticipant = async(req, res) =>
{
    const userID = req.user.id
    const groupID = req.params
    const participantID = req.body.participant

    const group = await groupServices.removeParticipant(userID, participantID, groupID)
    if (!group)
        return res.status(400).json("Failed to remove the selected participant").end()
    return res.status(200).json("Participant removed successfully").end()
}


// Delete group
const deleteGroup = async(req, res) => 
{
    const userID = req.user.id
    const groupID = req.params
    
    const userResult = await userServices.deleteUserGroup(userID, groupID)
    if (userResult)
        return res.status(400).json("Error while deleting the group")
    
    const deleteCount = await groupServices.deleteGroup(groupID, userID)
    if (deleteCount == 0)
        return res.status(400).json("Failed to delete the group").end()
    
    return res.status(200).json("Group deleted successfully").end()
    // delete all related tasks.
}


const searchUserGroups = async(req, res) => 
{
    const query = req.body.search
    const userID = req.user.id
    const foundGroups = await groupServices.searchUserGroups(userID, query)

    return res.status(200).json({msg: 'Found groups', groups: foundGroups}).end()
}

const searchGroups = async(req, res) =>
{
    const query = req.body.search
    const foundGroups = await groupServices.searchGroups(query)
    
    return res.status(200).json({msg: 'Search results', groups: foundGroups}).end()
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
    searchGroups,
    searchUserGroups
}