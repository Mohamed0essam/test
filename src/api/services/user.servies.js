const User = require('../models/user.model');
const Validation = require('../middlewares/userValidations.middleware');
const { sanitizeFilter } = require('mongoose');



// create user
const createUser = async({ email,  username, password}) => {
  // console.log({ email, username, password})

  const user =  new User({email, username, password})
  try{ 
    await user.save();
    return user;
  }catch(err){
    console.log(`creation err${err}`);
  }
}



// get all users(just for testing and dev)
const  getAllUsers = async ()=>{
  try
  {
    const users = await User.find({})
    return users
  }
  catch (err)
  {
    console.log("Get all users error: " + err)
  }
}



//check if the email exits
const findUserByEmail = async (email) => {
  try {
    
      // console.log(email);
      // const user = await User.findOne({email});
      const user = await User.findOne({email}, {createdAt:0, updatedAt:0, achievements:0, dayRecommendedPosts:0, joinedTodoLists:0, following:0}).select('+password');;
      // console.log(user);
      if (user)
      {
        const profileFollow = await User.findById(user._id, {followers:1, following:1})
      
        const followers = profileFollow.followers
        const follows = profileFollow.following

        let followerCount = followers.length
        let followCount = follows.length

        if (!followerCount)
          followerCount = 0
        if (!followCount)
          followCount = 0

        return {user, followerCount, followCount};
      }
      
      return null
  } catch (err) {

      console.log(`Error occurred in finding user by email: ${err}`);
      throw err; // Re-throwing the error to propagate it to the caller
  }
 
};



const findUserByUsername = async (username) =>
{
  try
  {
    // console.log(email);
    // const user = await User.findOne({email});
    const user = await User.findOne({username}, {createdAt:0, updatedAt:0, achievements:0, dayRecommendedPosts:0, joinedTodoLists:0}).select('+password');
    // console.log(user);
    return user;
  } 
  catch (err) 
  {

    console.log(`Error occurred in finding user by email: ${err}`);
    throw err; // Re-throwing the error to propagate it to the caller
  }
}



//  find a user with a given id
// and returns the user
const findUserById = async (id) => {
  // console.log(`Searching for user with ID: ${id}`); // Bad practice
  try {
    
    const user = await User.findById(id, {createdAt:0, updatedAt:0, achievements:0, dayRecommendedPosts:0, joinedTodoLists:0});
    // const postCount = user.createdPosts
    // console.log(postCount.length)
    // console.log('in findbyId');

    return user;
  } catch (err) {
    console.error(`Error occurred while finding user by ID: ${err}`);
    throw err; // Re-throw the error to propagate it to the caller
  }
}



// Show user profile
const readUserProfile = async(userID, profileID) =>
{
  try
  {
    const profileFollow = await User.findById(profileID, {followers:1, following:1})
    let isFollower = false
    
    const followers = profileFollow.followers
    const follows = profileFollow.following

    if (followers.includes(userID))
      isFollower = true

    const followerCount = followers.length
    const followCount = follows.length
    
    const profile = await User.findById(profileID, {username:1, firstName:1, lastName:1, firebaseID:1, profilePhoto:1, profileVisibility:1})

    return {profile, followerCount, followCount, isFollower}
  }
  catch (err)
  {
    console.log("Read user profile error: " + err)
  }
}



const getUsersCount = async () => {
  const usersCount = await User.countDocuments();
  return usersCount;
};



// Read user followers
const readFollowers = async(userID) =>
{
  try
  {
    const user = await User.findById(userID, {followers:1})
    const followers = await User.find({_id: {$in: user.followers}}, {firstName:1, lastName:1, profilePhoto:1})
    return followers
  }
  catch (err)
  {
    console.log("Read followers error: " + err)
  }
}



// Read user follows
const readFollows = async(userID) =>
{
  try
  {
    const user = await User.findById(userID, {following:1})
    const follows = await User.find({_id: {$in: user.following}}, {firstName:1, lastName:1, profilePhoto:1})
    return follows
  }
  catch (err)
  {
    console.log("Read follows error: " + err)
  }
}



// Read friends - those who follow the user and the user follows them back
const readFriends = async(userID) =>
{
  try
  {
    // const followList = await User.findById(userID, {_id:0, following:1})
    const followerList = await User.findById(userID, {_id:0, followers:1})

    // const friends = await User.find({_id: {$in: followList.following}, following: userID})
    const friends = await User.find({_id: {$in: followerList.followers}, followers: userID}, {_id:1, firebaseID:1, firstName:1, profilePhoto:1})
    
    return friends
  }
  catch (err)
  {
    console.log("Read friends error: " + err)
  }
}



// delete user
//
// update user data
const updateUser = async (userID, {firstName, lastName, gender, birthDate, phone, nationality, categoricalInterests, profilePhoto, firstLogin, profileVisibility, isOnline}, firebaseID) => {
  let user
  try {
    user = await User.findByIdAndUpdate(
    {_id: userID},
    {firstName, lastName, gender, birthDate, phone:phone, nationality, categoricalInterests, profilePhoto, firstLogin, profileVisibility, isOnline},
    { new: true }
    );
      
    const valid = await Validation.firebaseValidation(firebaseID)
    if ( valid === true)
      user = await User.findByIdAndUpdate({_id: userID}, {firebaseID: firebaseID})
    else
      console.log('Chat ID already exists or is not provided\n')
    
    user = await findUserById(userID);  // Solves the refresh problem.
    const userWithoutPassword = await user.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;
    
  } catch (error) {
    console.log(`Error updating user: ${error}`);
  }
};



// Follow another user
const followUser = async(userID, profileID) =>
{
  try
  {
    if (userID === profileID)
      return false
    
    const userExists = await User.findById(profileID, {_id:1})
    if (!userExists)
      return false

    const isFollowed = await User.findOne({$and: [{_id: profileID}, {followers: userID}]})
    if (isFollowed)
      return false
  
    const followingUser = await User.findByIdAndUpdate(userID, {$push: {following: profileID}})
    const followedUser = await User.findByIdAndUpdate(profileID, {$push: {followers: userID}})
    return {followingUser, followedUser}
  }
  catch (err)
  {
    console.log("Follow user error: " + err)
  }
}
  
  
  
// Unfollow another user
const unfollowUser = async(userID, profileID) =>
{
  try
  {
    const userExists = await User.findById(profileID, {_id:1})
    if (!userExists)
      return false
  
    const unfollowingUser = await User.findByIdAndUpdate(userID, {$pullAll: {following: [profileID]}})
    const unfollowedUser = await User.findByIdAndUpdate(profileID, {$pullAll: {followers: [userID]}})
    return {unfollowingUser, unfollowedUser}
  }
  catch (err)
  {
    console.log("Unfollow user error: " + err)
  }
}
  
  
  
// Remove follower - The same as unfollow only changing the order of the user and profile id's to authenticate.
const removeFollower = async(userID, profileID) =>
{
  try
  {
    const userExists = await User.findById(profileID, {_id:1})
    if (!userExists)
      return false
  
    const removingUser = await User.findByIdAndUpdate(userID, {$pullAll: {followers: [profileID]}})
    const removedUser = await User.findByIdAndUpdate(profileID, {$pullAll: {following: [userID]}})
    return {removingUser, removedUser}
  }
  catch (err)
  {
    console.log("Remove follower error: " + err)
  }
}



// Delete group from user's document
const deleteUserGroup = async(userID, groupID) =>
{
  try
  {
    const userGroups = await User.findByIdAndUpdate(userID, {$pullAll: {createdTodoLists: [groupID]}})      
    return await userGroups.createdTodoLists.includes(groupID)
  }
  catch (err)
  {
    console.log("Delete user group error: " + err)
  }  
}


  
const updateUserEmailVerification = async (userID)=>{
  let user 
  try{
    user = await User.findByIdAndUpdate(userID, {isEmailVerified: true})
    user = await findUserById(userID);  // Solves the refresh problem.
    const userWithoutPassword = await user.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;

  }catch(err){
    console.log('erorr in updateUserEmailVerification '+ err);
    return null
  }
}



// Add user authnToken to database
const updateUserKey = async(userID, key) =>
{
  try
  {
    let updatedKey = await User.findByIdAndUpdate(userID, {authenticationKey: key})
    updatedKey = await User.findById(userID, {_id:0, authenticationKey:1})
    return updatedKey.authenticationKey    
  }
  catch (err)
  {
    console.log("Update user key error " + err)
  }
}



// Add user session to database
const updateUserSession = async(userID, session) =>
{
  try
  {
    let updatedSession = await User.findByIdAndUpdate(userID, {session: session})
    updatedSession = await User.findById(userID, {_id: 0, session: 1})
    return updatedSession.session
  }
  catch (err)
  {
    console.log("Update user session error " + err)
  }
}



// Update user device tokens
const updateUserDeviceToken = async(userID, deviceT) =>
  {
    try
    {
      let updatedDeviceToken = await User.findByIdAndUpdate(userID, {$push: {deviceToken: deviceT}}) 
      updatedDeviceToken = await User.findById(userID, {_id: 0, deviceToken: 1})
      return updatedDeviceToken.deviceToken
    }
    catch (err)
    {
      console.log("Update user device token error " + err)
    }
  }



// Update user's online status
const updateUserOnlineStatus = async (userID, status) =>
{
  try
  {
    const userOnlineStatus = await User.findByIdAndUpdate(userID, {isOnline: status})
    return userOnlineStatus
  }
  catch (err)
  {
    console.log("Update user online status error " + err)
  }
}



// $regex: new RegExp(`.*${name.trim()}.*`, 'i')
const searchUsers = async(name) =>
{
  try 
  {
    const regExp = `.*${name.trim()}.*`
    const foundUsers = await User.find({$or: [
      {username: {$regex: new RegExp(regExp, 'i')}}
    ]}, {_id:1, firebaseID:1, username:1, firstName:1, lastName:1, profilePhoto:1})
    return foundUsers
  } 
  catch (err) 
  {
    console.log('Search users error: ' + err)
  }
}



module.exports={
  getAllUsers,
  readFollowers,
  readFollows,
  readUserProfile,
  readFriends,
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  getUsersCount,
  updateUser,
  followUser,
  unfollowUser,
  removeFollower,
  deleteUserGroup,
  updateUserEmailVerification,
  updateUserKey,
  updateUserDeviceToken,
  updateUserSession,
  updateUserOnlineStatus,
  searchUsers
}