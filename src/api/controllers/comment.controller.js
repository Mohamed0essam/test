const commentServices = require('../services/comment.services')


// Comment CRUD

// Create Comment
const createComment = async(req, res) =>
{
    const userID = req.user.id
    const {postID, content} = req.body

    const comment = await commentServices.createComment(userID, postID, content)

    if (!comment)
        return res.status(400).json("An error occurred")
    return res.status(200).json({msg: "Comment created successfully", comment: comment})
}


// Create Reply
const createReply = async(req, res) =>
{
    const userID = req.user.id
    const {commentID, content} = req.body
    const comment = await commentServices.createReply(userID, commentID, content)
    
    if (!comment)
        return res.status(400).json("An error occurred")
    return res.status(200).json({msg: "Reply created successfully", comment: comment})
}



// Delete Commen
const deleteComment = async(req, res) =>
{
    const userID = req.user.id
    const commentID = req.params
    const postID = req.body.postID

    const deletedComment = await commentServices.deleteComment(userID, postID, commentID)
    if (!deletedComment)
        return res.status(400).json("Something went wrong")
    return res.status(200).json("Comment deleted successfully")
}



// Delete Reply
const deleteReply = async(req, res) =>
{
    const userID = req.user.id
    const postID = req.body.postID
    const commentID = req.params
    const replyIndex = req.body.replyIndex

    const deletedReply = await commentServices.deleteReply(userID, postID, commentID, replyIndex)
    if (!deletedReply)
        return res.status(400).json("Something went wrong")
    return res.status(200).json("Reply deleted successfully")
}


module.exports = 
{
    createComment,
    createReply,
    deleteComment,
    deleteReply
}
