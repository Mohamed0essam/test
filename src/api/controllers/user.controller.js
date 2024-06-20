// create, read, update, delete -> Users CRUD Operations.
const validation = require('../middlewares/userValidations.middleware');
const User = require ('../models/user.model');
const userServices = require('../services/user.servies');
const groupServices = require('../services/group.services')
const authServices = require('../services/authn.services')


const getUserData = async (req, res)=>{
    // use service to get by id
    const userData= await userServices.findUserById(req.params.id); 
    
    if (!userData) {
        return res.status(400).json('erorr data').end()
    }

    
    return res.status(201).json({
    msg: "get userData successfully", 
    user: userData,
    sessionToken: req.headers.authorization
    }).end()
}



// Read user profile
const readUserProfile = async(req, res) =>
{
    const userID = req.user.id
    const profileID = req.params._id
    const owner = userID === profileID

    const profile = await userServices.readUserProfile(userID, profileID)
    const userGroups = await groupServices.readUserGroups(profileID, owner)
    
    if(!profile)
        return res.status(400).json("Error while reading this profile")
    return res.status(200).json({msg: "Profile successfully read", profile: profile, groups: userGroups})
}



// Read user follower
const readFollowers = async(req, res) =>
{
    const userID = req.user.id
    const followers = await userServices.readFollowers(userID)
    if (!followers)
        return res.status(400).json("Error while fetching followers")
    return res.status(200).json({msg: "Successfully fetchd followers", followers: followers})
}



// Read user follows
const readFollows = async(req, res) =>
{
    const userID = req.user.id
    const follows = await userServices.readFollows(userID)
    if (!follows)
        return res.status(400).json("Error while fetching follows")
    return res.status(200).json({msg: "Successfully fetched follows", follows: follows})
}


const readFriends = async(req, res) =>
{
    const userID = req.user.id
    const friends = await userServices.readFriends(userID)
    if (!friends)
        return res.status(400).json("Error while reading your friends").end()
    return res.status(200).json({msg:"Read friends successfully", friends: friends}).end()
}



const updateUserPassword = ()=>{
    //

}

const updateUserData = async (req,res) =>{
    // update user data
    const userID = req.user.id;
    const { firstName, lastName, gender, birthDate, phone, nationality, categoricalInterests, profilePhoto, firebaseID, firstLogin, profileVisibility } = req.body;
    let updatedUser = null
    if (await validation.phoneValidation(phone) === true)
    {
        updatedUser = await userServices.updateUser(userID, {firstName, lastName, gender, birthDate, 
            phone, nationality, categoricalInterests, profilePhoto, firstLogin, profileVisibility}, firebaseID);   
    }
    else
    {
        return res.status(402).send("Invalid Phone Number").end();  
    }

    if (!updatedUser) {
        return res.status(401).json('Invalid Data').end()
    }

    
    return res.status(201).json({
        msg: "user updated successfully",
        user: updatedUser,
        sessionToken: req.headers.auth
        }).end()
}



// To save key in DB after manual login && to update key in case user wants to
const updateUserKey = async(req, res) =>
{
    let key = req.headers.key
    const userID = req.user.id

    if (!userID)
        return res.status(404).json("Not Found").end()

    if (!key)
    {
        const user = await userServices.findUserById(userID)
        
        if (user)
        {
            if (user.authenticationKey)
                return res.status(201).json("Key already exists for this user")
            key = await authServices.generateAccessToken(user, process.env.authnKey, process.env.authnExpiration)
            updatedKey = await userServices.updateUserKey(userID, key)
            if (updatedKey)
                return res.status(200).json({msg:"Key updated successfully", key: updatedKey}).end()
            else
                return res.status(400).json("Something went wrong").end()
        }
    }
    else
    {
        if (await validation.keyValidation(userID, key))
            return res.status(200).json("Key already exists for this user").end()
        else
            return res.status(404).json("Not Found").end()
    }
} 



// Follow another user
const followUser = async(req, res) => 
{
    const userID = req.user.id
    const profileID = req.params._id
    const result = await userServices.followUser(userID, profileID)
    if (result === "Narcissist")
        return res.status(400).json("That is narcissistic of you").end()
    else if (!result.followedUser || !result.followingUser)
        return res.status(400).json("Something went wrong while following this user").end()
    return res.status(200).json("Followed user successfully").end()
}
    
    
    
// Unfollow another user
const unfollowUser = async(req, res) =>
{
    const userID = req.user.id
    const profileID= req.params._id
    const result = await userServices.unfollowUser(userID, profileID)
    if (!result.unfollowingUser || !result.unfollowedUser)
        return res.status(400).json("Something went wrong while unfollowing this user").end()
    return res.status(200).json("Unfollowed user successfully").end()
}
    
    
    
// Remove follower
const removeFollower = async(req, res) =>
{
    const userID = req.user.id
    const profileID = req.params._id
    const result = await userServices.removeFollower(userID, profileID)
    if (!result.removingUser || !result.removedUser)
        return res.status(400).json("Something went wrong while removing this follower").end()
    return res.status(200).json("Removed follower successfully").end()
}
    

const searchUsers = async(req, res) =>
{
    const name = req.body.search
    const foundUsers = await userServices.searchUsers(name)
    if (!foundUsers)
        return res.status(400).json("No search results found").end()
    return res.status(200).json({msg: "Search results", results: foundUsers})
}

module.exports = {
    getUserData,
    readUserProfile,
    readFollowers,
    readFollows,
    readFriends,
    updateUserData,
    updateUserPassword,
    updateUserKey,
    followUser,
    unfollowUser,
    removeFollower,
    searchUsers
}