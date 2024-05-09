const User = require ('../models/user.model')
const jwt = require("jsonwebtoken");



const generateAccessToken = ({ _id, username, email }) => {
    const sessionToken = jwt.sign(
      {
        _id,
        username,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.jwtExpiration,
      }
    );
    return sessionToken;
  };
  

const decodeAccessToken = (accessToken) => {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          console.log(err);
          return null;
        }
        console.log(decoded)

        return decoded;
      }
    );
    return decoded; 
  };

  const changePassword = async (newHasedPassword, user) => {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        password: newHasedPassword,
        
      },
      { new: true }
    );
    return updatedUser;
  };


  module.exports = {
    
    decodeAccessToken,
    changePassword,
    generateAccessToken,
}