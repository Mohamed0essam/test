const User = require('../models/user.model');
const Validation = require('../middlewares/userValidations.middleware');
const { sanitizeFilter } = require('mongoose');
// create user
const createUser = async({ email, username, password}) => {
    console.log({ email, username, password})

    const user =  new User({email, username, password})
    try{ await user.save();
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
      const user = await User.findOne({email}).select('+password');;
      console.log(user);
      return user;
  } catch (err) {

      console.log(`Error occurred in finding user by email: ${err}`);
      throw err; // Re-throwing the error to propagate it to the caller
  }
 
};

//  find a user with a given id
// and returns the user
const findUserById = async (id) => {
  console.log(`Searching for user with ID: ${id}`); // Bad practice
  try {
    
    const user = await User.findById(id, {email:1, firstName: 1, lastName: 1, birthDate:1, username: 1, firebaseID: 1, createdPosts:1, followers: 1, following: 1, nationality:1, profilePhoto: 1});
    const postCount = user.createdPosts
    console.log(postCount.length)
    // console.log('in findbyId');

    return user;
  } catch (err) {
    console.error(`Error occurred while finding user by ID: ${err}`);
    throw err; // Re-throw the error to propagate it to the caller
  }
};

  const getUsersCount = async () => {
    const usersCount = await User.countDocuments();
    return usersCount;
  };
// delete user
//
// update user data
const updateUser = async (userID, {firstName, lastName, gender, birthDate, nationality, categoricalInterests, profilePhoto}, firebaseID) => {
  let user
  try {
      user = await User.findByIdAndUpdate(
        {_id: userID},
        {firstName, lastName, gender, birthDate, nationality, categoricalInterests, profilePhoto},
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

module.exports={
    
    getAllUsers,
    createUser,
    findUserByEmail,
    findUserById,
    getUsersCount,
    updateUser,
}