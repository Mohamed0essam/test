// create, read, update, delete -> Users CRUD Operations.
const User = require ('../models/user.model');
const userService = require('../services/user.servies');


const getUserData = async (req, res)=>{
    // use service to get by id
    const userData= await userService.findUserById(req.params.id); 
    
    if (!userData) {
        return res.status(400).json('erorr data').end()
    }

    
    return res.status(201).json({
    msg: "get userData successfully", 
    user: userData,
    sessionToken: req.headers.authorization

    
}).end()

}   

const updateUserPassword = ()=>{
    //

}

const updateUserData = async (req,res) =>{
    // update user data
    const userID = req.user.id;
    const { firstName, lastName, gender, birthDate, nationality, categoricalInterests, profilePhoto, firebaseID } = req.body;
    const updatedUser = await userService.updateUser(userID, {firstName, lastName, gender, birthDate, 
        nationality, categoricalInterests, profilePhoto}, firebaseID);

    if (!updatedUser) {
        return res.status(400).json('Invalid data').end()
    }

    
    return res.status(201).json({
        msg: "user updated successfully",
        user: updatedUser,
        sessionToken: req.headers.authorization
        }).end()
}


module.exports = {
    updateUserPassword,
    getUserData,
    updateUserData,
}