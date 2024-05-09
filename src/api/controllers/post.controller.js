// Post CRUD
const postServices = require('../services/post.services')


// Create post
const createPost = async(req, res) =>
{
    const {userID, groupID, taskID, content, attachedMedia} = req.body
    const newPost = await postServices.createPost({userID, groupID, taskID, content, attachedMedia})
    if (!newPost)
        return res.status(400).json("Invalid data").end()
    
    return res.status(200).json({msg: "Post created successfully", post: newPost}).end() 
}


// Read all posts
const readAllPosts = async(req, res) =>
{
    const posts = await postServices.readAllPosts()
    if (!posts)
        return res.status(404).json('Could not fetch all posts').end()
    
    return res.status(200).json(posts).end()
}


// Read post
const readPost = async(req, res) =>
{
    const postID = req.params
    const foundPost = await postServices.readPost(postID)
    if (!foundPost)
        return res.status(404).json('Post not found').end()
    
    return res.status(200).json(foundPost).end()
}


// Update post
const updatePost = async(req, res) =>
{
    const postID = req.params
    const {groupID, taskID, content, attachedMedia} = req.body
    const updatedPost = await postServices.updatePost(postID, groupID, taskID, {content, attachedMedia})
    if (!updatedPost)
        return res.status(404).json('Could not update post').end()
    
    return res.status(200).json({msg:'Post updated successfully', post: updatedPost}).end()
}


// Delete post
const deletePost = async(req, res) => 
{
    const postID = req.params
    const deleteCount = await postServices.deletePost(postID)
    if (deleteCount <= 0)
        return res.status(404).json('Could not delete post').end()
        
    return res.status(200).json('Post deleted successfully').end()
}


// Search posts
const searchPosts = async(req, res) =>
{
    
}


module.exports = 
{
    createPost,
    readAllPosts,
    readPost,
    updatePost,
    deletePost,
    searchPosts
}