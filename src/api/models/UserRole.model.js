const mongoose = require('mongoose');

const UserRoleSchema = new mongoose.Schema(
    {
        role: {type:String}

    }
)

const  UserRoleModel = mongoose.model('UserRole',UserRoleSchema);

module.exports = UserRoleModel ; 