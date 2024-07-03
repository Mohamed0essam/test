const User = require('../models/user.model')
const Group = require('../models/group.model')

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


const phoneValidation = async(phone) => 
{
    const phoneNumberRegex = /^(?:010|011|012|015)\d{8}$/; // Ensures an Egyptian phone number
    if (phoneNumberRegex.test(phone))
        return true
    return false
}


const userRole = async(userID, groupID) => 
{
    try
    {
        // {owner:1, joinedUsers:1, privacy:1}
        const group = await Group.findById(groupID)
        let array = null
        if (group.joinedUsers)
            array = group.joinedUsers

        if (userID == group.owner)
        {
            console.log("status: 200")
            return 200
        }
        else if (array.includes(userID))
        {
            console.log("status: 201")
            return 201
        }
        else if (group.privacy === "public")
        {
            console.log("status: 202")
            return 202
        }
        else
        {
            return 404
        }
    }
    catch (err)
    {
        console.error(`Error in userRole : ${err}`)
    }
}


// Comparing the hashed authentication keys
const keyValidation = async(userID, key) =>
{
    // For now, direct comparison.
    // Later, it will be comparing key hashes.
    try
    {
        const user = await User.findById(userID, {_id: 0, authenticationKey: 1})
        return user.authenticationKey === key
    }
    catch (err)
    {
        console.log("Key validation error: " + err)
    }
}





module.exports = 
{
    firebaseValidation,
    phoneValidation,
    userRole,
    keyValidation
}