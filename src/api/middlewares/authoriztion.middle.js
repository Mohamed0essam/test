const User = require('../models/user.model');
const Group = require('../models/group.model');
const Post = require('../models/post.model');
const Task = require('../models/task.model');
const groupServices =   require('../services/group.services');



// check admin role, group
const groupAdminCheck = async (req, res, next)=>{
    const userID = req.user.id;
    const groupID = req.body.groupID || req.params;
    // const groupID = req.params;
    // console.log( groupID + "here")
    const group = await Group.findById(groupID, {owner:1});
    console.log(groupID)
    if(!group){
        return res.status(404).json("group not found").end()
    }

    if(userID !== String(group.owner)){
        // console.log(group.owner + " hl")
        return res.status(400).json("access denied").end() 
    }
    next();
}


const groupParticipantCheck = async(req, res, next) =>
{
    const userID = req.user.id
    const groupID = req.body.groupID || req.params
    const group = await Group.find({_id: groupID, joinedUsers: userID})
    
    if (!group)
        return res.status(404).json("Group not found").end()
    next()   
}

//check user role , group read



//group 

// post 

//task


// admin can read 
// onwer (of post, task)? can read, update, delete. 
// user (if group is public)? can read : can't read. group, post or task. check.



module.exports = {
    groupAdminCheck,
    groupParticipantCheck
}

