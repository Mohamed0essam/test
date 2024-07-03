const User = require ('../models/user.model')
const jwt = require("jsonwebtoken");
const validation = require('../middlewares/userValidations.middleware')


const refreshSessionToken = async(user, authnToken) =>
{
  try
  {
  // Frontend can redirect the user to refresh the session token every 28 minutes or so before its actual expiration for better user experience.
  // Frontend wilauthnRouterl send the old session token which is 2 minutes away from expiring here and the authentication token.
  
  const validToken = await validation.keyValidation(user._id, authnToken)

  if (validToken)
    return await generateAccessToken(user, process.env.sessionKey, process.env.sessionExpiration)
  
  return false
  }
  catch (err)
  {
    console.log("Refresh session token error: " + err)
  }
}


const generateAccessToken = ({ _id }, secret, expiration) => {
  const token = jwt.sign(
    {
      // u_id is enough, later on, it will be encrypted because a JWT can be easily b64 decoded, effectively reading the data within.
      // Timestamps (issuedAt_iat and expiry_exp) are important to enforce expiration and determine when was the last login or time of token generation.
      _id,
      iat: Math.floor(Date.now() / 1000),   
      // Issued right now at this moment. 
      // Used to determine last session and cancel validity later on. 
      // Also has some uses in DB for authnToken
    },
    secret,
    {
      expiresIn: expiration,
    }
  );
    return token;
};
  

const decodeAccessToken = (accessToken, secret) => {
    const decoded = jwt.verify(
      accessToken,
      secret,
      function (err, decoded) {
        if (err) {
          console.log(err);
          return null;
        }
        // console.log(decoded)

        return decoded;
      }
    );
    return decoded; 
  };


  const changePassword = async (newHasedPassword, user) => {
    try
    {
    
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          password: newHasedPassword,
        
        },
        { new: true }
      );
      return updatedUser;
    }
    catch (err)
    {
      console.log("Change password error: " + err)
    }
  };


  module.exports = {
    decodeAccessToken,
    changePassword,
    generateAccessToken,
    refreshSessionToken
}