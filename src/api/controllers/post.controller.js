// Post CRUD
const postServices = require('../services/post.services')


// Create post
const createPost = async(req, res) =>
{
    const userID = req.user.id
    const {groupID, taskID, content, visibility, attachedMedia} = req.body
    const newPost = await postServices.createPost({userID, groupID, taskID, content, visibility, attachedMedia})
    if (!newPost)
        return res.status(400).json("Invalid data").end()
    
    return res.status(200).json({msg: "Post created successfully", post: newPost}).end() 
}


// Read all posts
const readAllPosts = async(req, res) =>
{
    const userID = req.user.id  // Use it to see if the current user liked any of the sent posts
    const posts = await postServices.readAllPosts(userID)
    if (!posts)
        return res.status(404).json('Could not fetch all posts').end()
    
    return res.status(200).json(posts).end()
}


// Read post
const readPost = async(req, res) =>
{
    const userID = req.user.id
    const postID = req.params
    const foundPost = await postServices.readPost(userID, postID)
    if (!foundPost)
        return res.status(404).json('Not found').end()
    
    return res.status(200).json({Post: foundPost}).end()
}


// Update post
const updatePost = async(req, res) =>
{
    const userID = req.user.id
    const postID = req.params
    const {content, attachedMedia} = req.body
    const updatedPost = await postServices.updatePost(userID, postID, {content, attachedMedia})
    if (!updatedPost)
        return res.status(404).json('Could not update post').end()
    
    return res.status(200).json({msg:'Post updated successfully', post: updatedPost}).end()
}


const likePost = async(req, res) =>
{
    const userID = req.user.id
    const postID = req.body.post
    const likedPost = await postServices.likePost(postID, userID)
    
    if (!likedPost)
        return res.status(404).json("Not found")
    
    return res.status(200).json("Liked successfully")
}


const unlikePost = async(req, res) =>
{
    const userID = req.user.id
    const postID = req.body.post
    const unlikedPost = await postServices.unlikePost(postID, userID)

    if (!unlikedPost)
        return res.status(404).json("Not found")

    return res.status(200).json("Unliked successfully")
}


// Delete post
const deletePost = async(req, res) => 
{
    const userID = req.user.id
    const postID = req.params

    const deleteCount = await postServices.deletePost(userID, postID)

    if (deleteCount <= 0)
        return res.status(404).json('Could not delete post').end()
        
    return res.status(200).json('Post deleted successfully').end()
}


// Search posts
const searchPosts = async(req, res) =>
{
    
}

// get recommendation posts 

const getRecommendedPosts = async (req, res) => {
    // const userID = req.user.id 

    const userID = req.body.userID;
   

    try {
        
        console.log(`controller ${userID}`)
    
      const postIDs = await postServices.getPostsData(userID);
      
      const posts = [];
      for (let i = 0; i < Math.min(20, postIDs.length); i++) {
        const post = await postServices.readPost(postIDs[i]);
        posts.push(post);
      }
  
      return res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = 
{
    createPost,
    readAllPosts,
    readPost,
    updatePost,
    likePost,
    unlikePost,
    deletePost,
    searchPosts,
    getRecommendedPosts
}