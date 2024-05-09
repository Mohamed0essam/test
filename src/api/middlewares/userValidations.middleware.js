const User = require('../models/user.model')

const firebaseValidation = async(id) =>
{
    const regex = /^[^ ]{28}$/
    if (id && regex.test(id))
    {
        const idCheck = await User.findOne({firebaseID: id})
        if (idCheck === null)
            return true   // Implement a method to validate the format of the ID to prevent unwanted values.
    }
  return false
}


module.exports = 
{
    firebaseValidation
}