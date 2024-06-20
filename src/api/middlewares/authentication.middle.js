const authServices = require('../services/authn.services')
const userServices = require('../services/user.servies');

// a middleware that checks if the user has been authenticated
// and returns the user

// Checks authorization through session token
const checkSession = async (req, res, next)=>{
    try
    {
        const accessToken = req.headers.auth;      // auth only, no other spellings
        if (!accessToken){
            return res.status(400).json({msg:"Token is required"})
        }
        const  decodedToken = authServices.decodeAccessToken(accessToken, process.env.sessionKey);
        if (!decodedToken){
            return res.status(401).json({msg:"Token has expired"})
        }
        const user = await userServices.findUserById(decodedToken._id);

        if(!user){
            return res.status(401).json({msg:"not allowed"});

        }
        req.user = user;
        // console.log('auth check req. user'+ req.user)
        next();
    }
    catch (err)
    {
        console.log("Check auth error: " + err)
    }
}

// Checks authentication through authentication token
// const checkAuthn = async(req, res, next) =>
// {
//     const authnToken = req.headers.key

//     if (!authnToken)
//         return res.status(404).json('Not Found').end()

//     const decodedToken = 
// }


module.exports = {
    checkSession,
}