
const User = require('../models/user.model');
const userService = require('../services/user.servies');
const passwordUtils = require('../utils/password.utils');
const authServices = require('../services/authn.services') ;


const register = async (req, res)=>{
 
// try  to create a new user with this information

    const {email,username, password, deviceToken} =  req.body;
    //check  email  Exists
    const userEmailExists = await userService.findUserByEmail(email);
    const usernameExists = await userService.findUserByUsername(username);


    if (!userEmailExists)
    {
        if (usernameExists)
            return res.status(402).json({msg:"This username is unavailable"})
    } 
    else
        return res.status(401).json({msg:"This email already exists"});

    // create utill password for hashing


    const HashedPassword = passwordUtils.hashPassword(password);
    // console.log('HashedPassword is'+ HashedPassword)

    const newUser =await userService.createUser({
        email,
        username,
        password: HashedPassword,
        $push: {deviceToken: deviceToken}
    });

    //send res and msg user have been created 
    if(!newUser){
       return res.status(400).json({msg:'failed to create the user'})
    }

    await newUser.save()

    const sessionToken = authServices.generateAccessToken(newUser, process.env.sessionKey, process.env.sessionExpiration);
    const authnToken = authServices.generateAccessToken(newUser, process.env.authnKey, process.env.authnExpiration)
    await userService.updateUserOnlineStatus(newUser._id, true)
    const updatedAuthnToken = await userService.updateUserKey(newUser._id, authnToken)
    const updatedSession = await userService.updateUserSession(newUser._id, sessionToken)
    // console.log(updatedAuthnToken)

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    delete userWithoutPassword.authenticationKey
    delete userWithoutPassword.session

    return res.status(200).json({
        msg:'created succussfully',
        user: userWithoutPassword, 
        sessionToken: String(updatedSession),
        authnToken: updatedAuthnToken
    })
        
    //use userService to save the user data 



}
const getAllUsers = async(req, res)=>{
    const users =  await userService.getAllUsers();
    if(!users){
        return  res.status(404).json({msg:'no users found'})
    }

    return  res.status(200).json({msg:'users found', users});
}

const login = async (req, res) => {
// check credintionls 
    const   {email , password} = req.body;
    const userFull = await userService.findUserByEmail(email);
    // const user = userService.findUserById(_id);
    if(!userFull){
        return res.status(401).json( {msg:"Invalid Credentials"});}
    // console.log(user._id, password)

    const isValidPass = passwordUtils.comaparePasswords(password, userFull.user.password);
    if (!isValidPass) { 
        return res.status(401).json ({msg : "Invalid credentials, wrong password"});
    }
    
    const sessionToken = authServices.generateAccessToken(userFull.user, process.env.sessionKey, process.env.sessionExpiration);
    const authnToken = authServices.generateAccessToken(userFull.user, process.env.authnKey, process.env.authnExpiration)
    await userService.updateUserOnlineStatus(userFull.user._id, true)

    const updatedAuthnToken = await userService.updateUserKey(userFull.user._id, authnToken)
    const updatedSession = await userService.updateUserSession(userFull.user._id, sessionToken)
    
    // const temp = authServices.decodeAccessToken(authnToken, process.env.authnKey)
    // console.log(updatedAuthnToken)
    // console.log(Date.now())
    
    const userWithoutPassword = userFull.user.toObject();
    delete userWithoutPassword.password;
    delete userWithoutPassword.authenticationKey
    delete userWithoutPassword.session

    return res.status(200).json({
        msg:'login succussfully',
        user: userWithoutPassword, 
        followerCount: userFull.followerCount,
        followCount: userFull.followCount,
        sessionToken: String(updatedSession),
        authnToken: updatedAuthnToken
    })
}


const keyLogin = async(req, res) =>
{
    const key = req.headers.key
    const decodedKey = await authServices.decodeAccessToken(key, process.env.authnKey)
    // console.log(decodedKey)
    
    const user = await userService.findUserById(decodedKey._id)
    await userService.updateUserOnlineStatus(decodedKey._id, true)
    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    if (key === userWithoutPassword.authenticationKey)
    {
        delete userWithoutPassword.authenticationKey
        delete userWithoutPassword.session

        const sessionToken = authServices.generateAccessToken(userWithoutPassword, process.env.sessionKey, process.env.sessionExpiration)
        const updatedSession = await userService.updateUserSession(decodedKey._id, sessionToken)
        return res.status(200).json({msg: "User found", user: userWithoutPassword, sessionToken: String(updatedSession)})
    }
    return res.status(404).json("Not Found")
}

const logout = async (req, res)=>{
// delete the session token and login token (or same token)

// 
}

const verifyEmail = async(req, res)=>{
     //send email with code and check it match with time using api

} 
const forgotPassword = async (req, res)=>{
//call update password services  to update the password

}

const resetPassword = async (req, res)=>
{    
    const userID = req.user.id

    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    const hashedNew = passwordUtils.hashPassword(newPassword)

    const user = await userService.findUserById(userID)
    
    if (oldPassword === newPassword)
        return res.status(202).json("The new password shouldn't be the old one.")
    if (!user)
        return res.status(404).json("Not Found")
    if (!passwordUtils.comaparePasswords(oldPassword, user.password))
        return res.status(400).json("Wrong password")

    
    await User.findByIdAndUpdate(userID, {password: hashedNew})
    const userWithPassword = await userService.findUserById(userID)
    
    if (userWithPassword)
    {
        const userWithoutPassword = userWithPassword.toObject()
        delete userWithoutPassword.password
        delete userWithoutPassword.authenticationKey

        return res.status(200).json({msg: "Password updated successfully", user: userWithoutPassword})
    }

    return res.status(401).json("Something went wrong")
}



const refreshSessionToken = async(req, res) =>
{
    const user = req.user
    const authnToken = req.headers.key

    if (!user || !authnToken)
        return res.status(404).json("Not Found")

    const session = await authServices.refreshSessionToken(user, authnToken)
    // console.log(session)
    if (session)
        return res.status(200).json({msg: "Token renewd successfully", sessionToken: session})
    
    return res.status(400).json("Something went wrong")
}


module.exports = {
    register,
    login,
    keyLogin,
    logout,
    verifyEmail,
    resetPassword,
    forgotPassword,
    getAllUsers,
    refreshSessionToken
}