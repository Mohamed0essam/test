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
            const post = await Post.findByIdAndUpdate(postID, {$push :{comments: savedComment}})
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
        let comment = await Comment.findByIdAndUpdate(commentID, {$push: {replies: {owner: userID, content: content}}})
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
        const post = await Post.findById(postID, {_id: 0, owner: 1})
        const comment = await Comment.findById(commentID, {_id: 0, owner:1, post: 1})
        if (comment.post != postID)
            return false

        if (comment.owner == userID || post.owner == userID)
        {
            const deletedComment = await Comment.findByIdAndDelete(commentID)
            if (!deletedComment)
                return false
        }
        else
            return false

        const deletedFromPost = await Post.findByIdAndUpdate(postID, {$pullAll: {comments: [commentID]}})
        console.log(deletedFromPost)
        return deletedFromPost
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
        const post = await Post.findById(postID, {_id: 0, owner: 1})
        const comment = await Comment.findById(commentID, {_id: 0, owner: 1, post: 1, replies: 1})
        
        if (comment.replies.length == 0 || comment.post != postID || replyIndex >= comment.replies.length)
            return false

        let removedReply = false
        if (comment.replies[replyIndex].owner == userID || post.owner == userID)
            removedReply = await Comment.findByIdAndUpdate(commentID, {$pull: {replies: comment.replies[replyIndex]}})
        else
            return false

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