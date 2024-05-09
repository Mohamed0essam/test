
const User    =  require('../models/user.model');
const userService = require('../services/user.servies');
const passwordUtils = require('../utils/password.utils');
const authServices = require ('../services/authn.services') ;


const register = async (req, res)=>{
 
// try  to create a new user with this information

    const {email,username, password} =  req.body;
    //check  email  Exists
    const userExist= await userService.findUserByEmail(email);

    if(userExist) return res.status(400).json({msg:"this Email is already exist",  user: userExist});// just for test, well remore userdata

    // create utill password for hashing


    const HashedPassword = passwordUtils.hashPassword(password);
    // console.log('HashedPassword is'+ HashedPassword)

    const newUser =await userService.createUser({
        email, username, password: HashedPassword
    });  

    //send res and msg user have been created 
    if(!newUser){
       return res.status(400).json({msg:'failed  to create the user'})
    }
    const sessionToken = authServices.generateAccessToken(newUser);
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({
        msg:'created succussfully',
        user: userWithoutPassword, 
        sessionToken: sessionToken,
        
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
    const user = await userService.findUserByEmail(email);
    // const user = userService.findUserById(_id);
    if(!user){
        return res.status(401).json( {msg:"Invalid Credentials"});}
    // console.log(user._id, password)

    const isValidPass = passwordUtils.comaparePasswords(password, user.password);
    if (!isValidPass) { 
        return res.status(401).json ({msg : "Invalid credentials, wrong password"});
    }

    const sessionToken = authServices.generateAccessToken(user);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({
        msg:'login succussfully',
        user: userWithoutPassword, 
        sessionToken,
    })
    
}

const logout = async (req, res)=>{
// delete the session token and login token (or same token)

// 
}

const verifyEmail = async(req, res)=>{
     //send email with code and check it match with time using api

} 
const resetPassword = async (req, res)=>{
//call update password services  to update the password

}

const forgotPassword = async (req, res)=>{
    
// check the old password match

// reset the update password services 

}


module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    resetPassword,
    forgotPassword,
    getAllUsers,

}