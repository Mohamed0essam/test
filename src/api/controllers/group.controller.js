// CRUD Operations
// Status codes will be changed to appropriate ones
// Will encrypt all parameters and tokens

const Group = require('../models/group.model')
const groupServices = require('../services/group.services')


// Create group
const  createGroup = async (req, res) => 
{
    const {name, owner, description, startDate, endDate, privacy, groupPhoto} = req.body;
    const newGroup = await groupServices.createGroup({name, owner, description, startDate, endDate, privacy, groupPhoto});
    if (!newGroup)
        return res.status(400).json("Invalid data").end()
    
    return res.status(200).json( { message: "Group created successfuly", Group: newGroup }).end()
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
    const group = await groupServices.readGroup(groupID)
    if (!group)
        res.status(400).json( "No such group" ).end()
        
    return res.status(200).json({msg: "Group found successfully", Group: group}).end()
}

// Read user groups
const readUserGroups = async(req, res) =>
{
    const userID = req.user.id
    const groups = await groupServices.readUserGroups(userID)
    if (!groups)
        return res.status(400).json("User has no groups").end()
    return res.status(200).json({msg:'Groups found', groups : groups}).end()
}

// Update group
const updateGroup = async(req, res) => 
{
    const groupID = req.params
    const {name, description, groupPhoto, endDate, attachedFiles, privacy, moderator, moderatorConfig} = req.body
    const updatedGroup = await  groupServices.updateGroup(groupID , {name, description, groupPhoto, endDate, attachedFiles, privacy, moderator, moderatorConfig})
    if (!updatedGroup)
        return res.status(400).json("No such group").end()
        
    return res.status(200).json({msg : "Group updated successfully", group: updatedGroup})
}

// Delete group
const deleteGroup = async(req, res) => 
{
    const groupID = req.params
    const deleteCount = await groupServices.deleteGroup(groupID)
    if (deleteCount <= 0)
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
    updateGroup,
    deleteGroup,
    searchGroups,
    searchUserGroups
}