// Post CRUD
const Post = require('../models/post.model')


// Create post
const createPost = async({userID, groupID, taskID, content, attachedMedia}) =>
{
    try 
    {
        const tempPost = new Post
        (
            {
                owner: userID, 
                group: groupID, 
                task: taskID, 
                content: content, 
                attachedMedia: attachedMedia
            }
        )
        const newPost = await tempPost.save()
        return newPost
    }
    catch (err)
    {
        console.log('Create post error: ' + err)
    }
}


// Read all posts
const readAllPosts = async() => 
{
    try
    {
        const  posts = await Post.find({})
        return posts
    }
    catch (err) 
    {
        console.log('Read all posts error: ' + err)
    }
}


// Read post
const readPost = async(postID) => 
{
    try 
    {
        const post = await Post.findById(postID)
        return post
    }
    catch (err)
    {
        console.log('Read post error: ' + err)
    }
}


// Update post
const updatePost = async(postID, groupID, taskID, updates) => 
{
    try
    {
        const tempPost = await Post.findByIdAndUpdate(postID, updates)
        const updatedPost = Post.findById(postID)
        return updatedPost
    }
    catch (err)
    {
        console.log('Update post erros: ' + err)
    }
}


// Delete post
const deletePost = async(postID) =>
{
    try
    {
        const deleteCount = await Post.findByIdAndDelete(postID)
        return deleteCount
    }
    catch (err)
    {
        console.log('Delete post error:' + err)
    }
}


// Search posts
const searchPosts = async(searchQuery) =>
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