const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema
(
    {
        owner: 
        {
            type:mongoose.Schema.Types.ObjectId, ref:"User", 
            required:true
        },
        content: 
        {
            type: String, required: true
        }
    }
);

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
                type: CommentSchema, unique: false, required: false
            }
        ]
},
    {
        timestamps: true,   
    }
)

module.exports = mongoose.model("Post",PostSchema);