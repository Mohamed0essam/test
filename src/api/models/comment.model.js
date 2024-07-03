const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema
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
    },
    {
        timestamps: true
    }
);

const CommentSchema = new mongoose.Schema
(
    {
        owner: 
        {
            type:mongoose.Schema.Types.ObjectId, ref:"User", 
            required:true
        },
        post: 
        {
            type:mongoose.Schema.Types.ObjectId, ref:"Post", 
            required:true
        },
        content: 
        {
            type: String, required:true
        },
        replies: 
        [
            {
                type: ReplySchema, unique: false, required: false
            }
        ]
},
    {
        timestamps: true,   
    }
)

module.exports = mongoose.model("Comment", CommentSchema)