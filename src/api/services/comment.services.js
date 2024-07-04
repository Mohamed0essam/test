const Comment = require('../models/comment.model')
const Group = require('../models/group.model')
const Post = require('../models/post.model')
const User = require('../models/user.model')

// Comments CRUD

const createComment = async(userID, postID, content) =>
{
    try
    {
        const post = await Post.findById(postID, {_id: 1})
        if (!post)
            return false

        const comment = new Comment
        (
            {
                owner: userID,
                post: postID,
                content: content
            }
        )
        const savedComment = await comment.save()
    
        if (savedComment)
        {
            const post = await Post.findByIdAndUpdate(postID, {comments: savedComment})
            if (!post)
                return false
        }
        
        return savedComment
    }
    catch (err)
    {
        console.log("Create comment error: " + err)
    }
}



// Create Reply
const createReply = async(userID, commentID, content) =>
{
    try
    {
        let comment = await Comment.findByIdAndUpdate(commentID, {replies: {owner: userID, content: content}})
        if (!comment)
            return false
        
        comment = await Comment.findById(commentID)
        return comment
    }
    catch (err)
    {
        console.log("Create reply error: " + err)
    }
}



// Read Comment
const readComment = async(userID, postID, commentID) =>
{
    try
    {
        const comment = await Comment.findOne({_id: commentID, post: postID}, {post: 0})
        if (!comment)
            return false

        const commentOwner = await User.findById(comment.owner, {_id: 0, username: 1, firstName: 1, lastName: 1, profilePhoto: 1})

        let foundReplies = [], replyOwner

        for (reply of comment.replies)
        {
            replyOwner = await User.findById(reply.owner, {_id: 0, username: 1, firstName: 1, lastName: 1, profilePhoto: 1})
            
            foundReplies.push
            (
                {
                    "replyOwner": reply.owner,
                    "username": replyOwner.username,
                    "firstName": replyOwner.firstName,
                    "lastName": replyOwner.lastName,
                    "profilePhoto": replyOwner.profilePhoto,
                    "isReplyOwner": reply.owner === userID,
                    "content": reply.content,
                    "createdAt": reply.createdAt
                }
            )
        }
        
        const foundComment =
        {
            "commentID": commentID,
            "commentOwner": comment.owner,
            "username": commentOwner.username,
            "firstName": commentOwner.firstName,
            "lastName": commentOwner.lastName,
            "profilePhoto": commentOwner.profilePhoto,
            "isCommentOwner": comment.owner === userID,
            "content": comment.content,
            "createdAt": comment.createdAt,
            "replies": foundReplies
        }

        return foundComment
    }
    catch (err)
    {
        console.log("Read comment error: " + err)
    }
}


// Delete Comment
const deleteComment = async(userID, postID, commentID) =>
{
    try
    {
        const comment = await Comment.findById(commentID, {_id: 0, owner:1, post: 1})
        if (comment.post != postID || comment.owner != userID)
            return false

        const deletedComment = await Comment.findByIdAndDelete(commentID)
        return deletedComment
    }
    catch (err)
    {
        console.log("Delete comment error: " + err)
    }
}


// Delete Reply
const deleteReply = async(userID, postID, commentID, replyIndex) =>
{
    try
    {
        const comment = await Comment.findById(commentID, {_id: 0, owner: 1, post: 1, replies: 1})
        
        
        if (comment.replies.length == 0 || comment.post != postID || comment.replies[replyIndex].owner != userID)
            return false

        if (replyIndex >= comment.replies.length)
            return false

        const removedReply = await Comment.findByIdAndUpdate(commentID, {$pull: {replies: comment.replies[replyIndex]}})
        return removedReply
        
    }
    catch (err)
    {
        console.log("Delete reply error: " + err)
    }
}



module.exports =
{
    createComment,
    createReply,
    readComment,
    deleteComment,
    deleteReply
}