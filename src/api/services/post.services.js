// Post CRUD

const commentServices = require('./comment.services')
const groupServices = require('../services/group.services')
const Group = require('../models/group.model')
const participant = require('../middlewares/userValidations.middleware')
const Post = require('../models/post.model')
const User = require('../models/user.model')
const axios = require('axios');
const { report } = require('../routes/post.routes')
require('dotenv').config()

// Create post
const createPost = async({userID, groupID, taskID, content, visibility, attachedMedia}) =>
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
                visibility,
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
const readAllPosts = async(userID, postIDs) => 
{
    try
    {
        // const postIDs = await getPostsData(userID)
        // console.log("Hello",postIDs)

    //    let posts = await Post.find({_id: {$in: postIDs}}, {_id: 1, owner: 1, group: 1, createdAt: 1, content: 1, visibility: 1 ,attachedMedia: 1, likes: 1, comments: 1})
        // if (posts.length == 0)
    //    {
        const userGroups = await groupServices.readUserGroups(userID)
        const posts = await Post.find({group: {$in: userGroups}}, {_id: 1, owner: 1, group: 1, createdAt: 1, content: 1, visibility: 1 ,attachedMedia: 1, likes: 1, comments: 1}).sort({comments: -1, createdAt: 1})
        // }

        let collectedPosts = []
        let user, group, post, liked
        for (post of posts)
        {
            liked = false
            user = await User.findById(post.owner, {_id: 0, username: 1, firstName: 1, lastName: 1, profilePhoto: 1})
            group = await Group.findById(post.group, {_id: 0, name: 1})

            if(post.likes.includes(userID))
                liked = true

            if (!user || !group)
                continue
            
            collectedPosts.push
            (
                {
                    "postID": post._id,
                    "owner": post.owner,
                    "username": user.username,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "profilePhoto": user.profilePhoto,
                    "likedByUser": liked,
                    "groupName": group.name,
                    "content": post.content,
                    "attachedMedia": post.attachedMedia,
                    "likes": post.likes.length,
                    "commentsCount": post.comments.length,
                    "createdAt": post.createdAt
                }
            )
        }
        return collectedPosts
    }
    catch (err) 
    {
        console.log('Read all posts error: ' + err)
    }
}


// Read post
const readPost = async(userID, postID) => 
{
    try 
    {
        const post = await Post.findById(postID, {_id: 1, owner: 1, group: 1, createdAt: 1, content: 1, attachedMedia: 1, likes: 1, comments: 1})
        console.log(post)
        if (!post)
            return false

        const postOwner = await User.findById(post.owner, {_id: 0, username: 1, firstName: 1, lastName: 1, profilePhoto: 1})
        const postGroup = await Group.findById(post.group, {_id: 0, name: 1})
        let foundComments = []

        for (comment of post.comments)
        {
            foundComments.push
            (
                await commentServices.readComment(userID, postID, comment)
            )
        }
        
        const foundPost = 
        {
            "postID": post._id,
            "owner": post.owner,
            "username": postOwner.username,
            "firstName": postOwner.firstName,
            "lastName": postOwner.lastName,
            "profilePhoto": postOwner.profilePhoto,
            "isPostOwner": post.owner === userID,
            "likedByUser": post.likes.includes(userID),
            "groupName": postGroup.name,
            "createdAt": post.createdAt,
            "content": post.content,
            "attachedMedia": post.attachedMedia,
            "likes": post.likes.length,
            "commentsCount": post.comments.length,
            "comments": foundComments
        }

        return foundPost
    }
    catch (err)
    {
        console.log('Read post error: ' + err)
    }
}


// Read User's Posts for Owner Only
const readUserPosts = async(profileID, owner) =>
{
    try
    {
        let posts = null
        if (owner == true)
            posts = await Post.find({owner: profileID})

        if (!posts)
            return false
        return posts
    }
    catch (err)
    {
        console.log("Read user post error: " + err)
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


const reportPost = async(userID, postID) =>
{
    try
    {
        let post = await Post.findById(postID, {_id: 0, owner: 1})
        console.log(post)
        if (userID === post.owner)
            return false

        const reportedPost = await Post.findByIdAndUpdate(postID, {$push: {reports: userID}})

        post = await Post.findById(postID, {_id: 0, reports: 1})
        
        if (post.reports.length >= 5)
            await Post.findByIdAndDelete(postID)

        return reportedPost
    }
    catch (err)
    {
        console.log('Report post error: ' + err)
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




const getPostsData = async (userID) => {
    try {
      console.log(userID)
      //print(`this is the post service ${userID}`)
    //   const response = await axios.get(`http://127.0.0.1:8000/posts/recommendations/${userID}`);
      // process.env.MONGO_URI
  
      const response = await axios.get(`${process.env.MLURL}/posts/recommendations/${userID}`);
      
      const recommendations = response.data
      console.log(` post service ${recommendations}`)
  
      // Extract post IDs from the recommendationss
      // const postIDs = recommendations.map(recommendation => recommendation.post_id);
      const postIDs = Object.values(recommendations.post_id);
  
      return postIDs;
    } catch (error) {
      console.log(`Failed to fetch recommended posts erorr: ${error}`);
      return []
    }
};
  

const getPostsInGroup = async (groupID ) => {
      try {
          const groupPostsIDs = []
        //  console.log( `getPostsInGroup   group id :${groupID} \n`)
          
  
          // Query to find posts id 
          //const posts = await Post.find({ group: groupID });
          const posts = await Post.find({ group: groupID }).select('_id');
  
         // console.log( `getPostsInGroup   posts id : ${posts} \n`)
  
          // Extract the post IDs and push them into groupPostsIDs array
          posts.forEach(post => groupPostsIDs.push(post._id));
          return groupPostsIDs;
  
      }catch (err){
          console.log('Error getting posts in group:' + err)
          return null;
      }
  
}


const checkIfUserLikedPost = async(userID, postID)=>{
      //  check if the userID found in the array of Post.lieks 
      try {
          // Find the post by postID and check if userID is in the likes array
          const post = await Post.findById(postID).select('likes').exec();
      
          if (!post) {
            console.log(`Post with ID ${postID} not found`);
            return 0; // Post not found
          }
      
          // Check if userID exists in the likes array
          const userLiked = post.likes.some(id => id.equals(userID));
      
          return userLiked ? 1 : 0;
        } catch (err) {
          console.log('Error checking if user liked post: ' + err);
          return 0; // Return 0 on error
        }
  
}
  

const sendPostsData = async(url,data)=>{
  
    try{
        const sendResponse   = await axios.post(`${process.env.MLURL}/posts/${url}/`, data);
        // const response = await axios.get(`${process.env.MLURL}/posts/recommendations/${userID}`);
        // console.log(`\n  posts sendResponse${sendResponse}\n`)
        console.log("Posts sendResponse: " +  JSON.stringify(sendResponse.data, null, 2));
        return 1 
    }catch(err){
        console.log(`\n  posts sendResponse error ${err}\n`)
    }  
}


const getLikeCommentCount = async(postID)=>{
      try {
          const post = await Post.findById(postID).select('likes comments').exec();
          if (!post) {
              console.log(`Post with ID ${postID} not found`);
              return 0; // Post not found
              }
          return post.likes.length + post.comments.length;
      } catch (err) {
          console.log('Error getting like and comment count: ' + err);
          return 0; // Return 0 on error
      }           
}


const userLikeOrOwnPost = async(post_id , user_id )=>{
   // check if the post.like contains the user_id?
   // check if the post.author contains the user_id   
   try {
      const post = await Post.findById(post_id).select('likes owner').exec();
      if (!post) {
          console.log(`Post with ID ${post_id} not found`);
          return 0; // Post not found
          }
          const userLiked = post.likes.some(id => id.equals(user_id));
          const userOwns = post.owner.equals(user_id);
          return userLiked || userOwns;
          } catch (err) {
              console.log('Error checking if user liked post: ' + err);
              return 0; // Return 0 on error    
  }
}



module.exports = 
{
    createPost,
    readAllPosts,
    readPost,
    readUserPosts,
    updatePost,
    likePost,
    unlikePost,
    reportPost,
    deletePost,
    searchPosts,
    getPostsData,
    getPostsInGroup,
    checkIfUserLikedPost,
    sendPostsData,
    getLikeCommentCount,
    userLikeOrOwnPost
}