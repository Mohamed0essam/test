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
            type: String
        }, // not 
        attachedMedia: 
        [
            {
                type: String
            }
        ], // url 
        whoLiked: 
        [
            {
                type:mongoose.Schema.Types.ObjectId, ref:"User"
            }
        ],  
    }
);


/////////7x
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
            required:true
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
        ], //URL 
        whoLiked: 
        {
            type:mongoose.Schema.Types.ObjectId, ref:"User"
        },
        comments: 
        [
            {
                type: CommentSchema
            }
        ]
},
    {
        timestamps: true,   
    }
)

const PostModel = mongoose.model("Post",PostSchema);

module.exports = PostModel;