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



module.exports = 
{
    createComment,
    createReply
}
