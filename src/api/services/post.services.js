// Post CRUD
const Post = require('../models/post.model')
const Group = require('../models/group.model')
const User = require('../models/user.model')
const participant = require('../middlewares/userValidations.middleware')
require('dotenv').config()

// Create post
const createPost = async({userID, groupID, taskID, content, attachedMedia}) =>
{
    try 
    {
        // Checks if user is the group admin or a participant.
        const role = await participant.userRole(userID, groupID)
        if (role === 202 || role === 404 || !taskID)
            return false
        
        // Checks if the task is in the group.
        const group = await Group.findById(groupID)
        
        if (!group.tasks.includes(taskID))
            return false

        const post = new Post
        (
            {
                owner: userID, 
                group: groupID, 
                task: taskID, 
                content, 
                attachedMedia
            }
        )
        const createdPost = await post.save()
        return createdPost
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
        const posts = await Post.find({}, {_id: 1, owner: 1, group: 1, createdAt: 1, content: 1, attachedMedia: 1, likes: 1})
        let collectedPosts = []
        let user, group, post
        for (post of posts)
        {
            user = await User.findById(post.owner, {_id: 0, username: 1, firstName: 1, lastName: 1, profilePhoto: 1})
            group = await Group.findById(post.group, {_id: 0, name: 1})


            if (!user || !group)
                continue
            
            collectedPosts.push
            (
                {
                    "postID": post._id,
                    "username": user.username,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "profilePhoto": user.profilePhoto,
                    "isLiked": "",
                    "groupName": group.name,
                    "content": post.content,
                    "attachedMedia": post.attachedMedia,
                    "likes": post.likes.length,
                    "createdAt": post.createdAt,
                    // "comments": post.comments.length
                }
            )
        }
        return collectedPosts
        // return posts
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
const updatePost = async(userID, postID, updates) => 
{
    try
    {
        const post = await Post.findById(postID, {_id: 0, owner: 1})
        
        // Check if user is owner
        if (userID == post.owner)
        {
            await Post.findByIdAndUpdate(postID, updates)
            const updatedPost = Post.findById(postID)
            return updatedPost
        }

        return false
    }
    catch (err)
    {
        console.log('Update post erros: ' + err)
    }
}



const likePost = async(postID, userID) =>
{
    try
    {
        const post = await Post.findByIdAndUpdate(postID, {likes: [userID]})
        return post
    }
    catch (err)
    {
        console.log('Like post error: ' + err)
    }
}


const unlikePost = async(postID, userID) =>
{
    try
    {
        const post = await Post.findByIdAndUpdate(postID, { $pull: { likes: userID } })
        return post
    }
    catch (err)
    {
        console.log('Remove like error: ' + err)
    }
}



// Delete post
const deletePost = async(userID, postID) =>
{
    try
    {
        // Check if the provided user is the post owner.
        const post = await Post.findById(postID, {_id: 0, owner: 1})

        if (userID == post.owner)
        {
            const deleteCount = await Post.findByIdAndDelete(postID)
            return deleteCount
        }
        return false
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
// const getPostsData = async(userID)=>
//     {
//      const   posts = null
//         //
//         return posts
//     }

    const axios = require('axios');

const getPostsData = async (userID) => {
  try {
    console.log(userID)
    //print(`this is the post service ${userID}`)
    const response = await axios.get(`http://127.0.0.1:8000/recommendations/${userID}`);
    // process.env.MONGO_URI

    //const response = await axios.get(`${process.env.MLURL}/recommendations/${userID}`);
    
    const recommendations = response.data.recommendations;

    // Extract post IDs from the recommendations
    const postIDs = recommendations.map(recommendation => recommendation.post_id);
    return postIDs;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch recommended posts');
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
    getPostsData
}