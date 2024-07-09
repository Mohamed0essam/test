const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema
(
    {
        owner: 
        {
            type:mongoose.Schema.Types.ObjectId, ref:"User", 
            required:true
        },
        group: 
        {
            type:mongoose.Schema.Types.ObjectId, ref:"Group", 
            required:true
        },
        task: 
        {
            type:mongoose.Schema.Types.ObjectId, ref:"Task", 
            required:true,
        },
        content: 
        {
            type: String, required:true
        },
        visibility:
        {
            type: Boolean, required: true, default: true
        },
        attachedMedia: 
        [
            {
                type: String
            }
        ],
        likes: 
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        comments: 
        [
            {
                type:mongoose.Schema.Types.ObjectId, ref:"Comment", required: false
            }
        ],
        reports:
        [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "User"
            }
        ]
},
    {
        timestamps: true,   
    }
)

module.exports = mongoose.model("Post",PostSchema);