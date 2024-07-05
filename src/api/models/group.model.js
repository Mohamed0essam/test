const mongoose = require('mongoose')


const GroupSchema = new mongoose.Schema
(
    {    
        name: 
        {
            type: String,
            required: true,
        },

        owner: 
        {
            type: mongoose.Schema.Types.ObjectId, ref: "User",
            required: true
        },

        description: 
        {
            type: String
        },

        categories:
        [ 
            {
                // type should be a list of category names from the Category model
                // Will use category model to accomodate user-added categories
                type: String,
                required: true,
                enum: ["Community & Volunteering", "Entertainment", "Events", "Finance", "Health & Fitness", "Hobbies & Interests", "Home & Living", "Mental Health & Self-Care", "Personal Development", "Social & Relationships", "Travel & Leisure", "Work", "Miscellaneous"],
                default: "Miscellaneous"
            }
        ],  
        
        // Used to get tasks to prevent overloading the server with too many requests at once when searching through Task.
        tasks: 
        [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "Task"
            }
        ],
    
        startDate: 
        {
            type: Date,
            required: true,
            default: Date.now()
        },
    
        endDate: 
        {
            type: Date
        },
        
        //  for more facilities 
        attachedFiles: 
        [
            {
                type: String
            }
        ],

        privacy: 
        {
            type: String,
            required: true,
            enum: ["public","private"],
            default: "private"
        },

        groupPhoto:
        { 
            type: String,
            required:true,
            default:"https://firebasestorage.googleapis.com/v0/b/flutter-8741f.appspot.com/o/Posts%2Fimage%201.png?alt=media&token=2bec8652-fe25-49a7-8f95-be04b641fe80"
        }, // URL or file path

        moderator: 
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        joinedUsers: 
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                unique: true
            }
        ],

        points:
        {
            type: Number,
            required: true,
            default: 0
        }

    },
    {
        timestamps: true,
    }
);


const GroupModel = mongoose.model("Group", GroupSchema)

module.exports = GroupModel