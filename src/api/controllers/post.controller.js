// Post CRUD
const groupServices = require('../services/group.services')
const postServices = require('../services/post.services')


// Create post
const createPost = async(req, res) =>
{
    const userID = req.user.id
    const {groupID, taskID, content, visibility, attachedMedia} = req.body
    console.log({groupID, taskID, content, visibility, attachedMedia})
    const newPost = await postServices.createPost({userID, groupID, taskID, content, visibility, attachedMedia})
    if (!newPost)
        return res.status(400).json("Invalid data").end()
    
    return res.status(200).json({msg: "Post created successfully", post: newPost}).end() 
}


// Read all posts
const readAllPosts = async(req, res) =>
{
    const userID = req.user.id  // Use it to see if the current user liked any of the sent posts
    const postIDs = await getRecommendedPosts(userID)

    const posts = await postServices.readAllPosts(userID, postIDs)
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


// Read user posts
const readUserPosts = async(req, res) =>
{
    const userID = req.user.id
    const profileID = req.params._id
    let owner = true

    if (userID != profileID)
        owner = false    

    const posts = await postServices.readUserPosts(profileID, owner)
    if (!posts)
        return res.status(404).json("Not found")
    return res.status(200).json(posts).end()
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


// Report Post
const reportPost = async(req, res) =>
{
    const userID = req.user.id
    const postID = req.params

    const reportedPost = await postServices.reportPost(userID, postID)
    if (!reportedPost)
        return res.status(404).json("Not found")
    return res.status(200).json("Reported successfully")
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

const getRecommendedPosts = async (userID) => {
    // const userID = req.user.id 
   
  // **** send data to ML 
//    const userID = req.body.userID;


   const {ok , msg} =await updateMLData(userID)
   if(!ok) return res.status(404).json({msg : msg} )



    // **** get data from ML 

    try {
        
      let postIDs =[]
       postIDs = await postServices.getPostsData(userID);
      if( !postIDs.length  ){
        // return res.status(404).json({msg : "No  recommended posts found"})
        return []
      }
    //   const posts = [];
    //   for (let i = 0; i < Math.min(20, postIDs.length); i++) {
    //     const post = await postServices.readPost(postIDs[i]);
    //     posts.push(post);
    //   }
      
  
  
    //   return res.status(200).json(posts);
    return postIDs
    } catch (error) {
      console.log("Controller - Get recommended posts: " + error);
    //   return res.status(500).json({ message: 'Internal server error' });
    }
}



const updateMLData = async (userID)=>{  
    
    // Get the user's groups using the groupServices
    try{
        const userGroups = await groupServices.getUserGroups(userID);
        // console.log(`controller: groups of ${userID} are : ${userGroups } \n end `)
       
        if (!userGroups.length ){
          let msg = ' No groups found, please join groups first' 
          console.log(msg)
          return {"ok":0, msg}
        }



        // Find posts ID and users ID using the groups
        const groupPostsUsers = await Promise.all(userGroups.map(async (group) => {
            // console.log(` \n groups posts : group  \n id  : X${group._id}X`)
            const groupPostsIDs = await postServices.getPostsInGroup(group._id);
            console.log(`groupPostsIDs ${groupPostsIDs} \n`)
            
            const groupUsersIDs = await groupServices.getUsersInGroup(group._id);
            console.log(`groupUsersIDs : ${groupUsersIDs}`)
            return { groupPostsIDs, groupUsersIDs };
        }))

      // Loop through each post and check if each user in the group liked the post
      const postViewCounts = [];
      const postLikesData = [];
      for (const { groupPostsIDs, groupUsersIDs } of groupPostsUsers) {
        for (const post_id of groupPostsIDs) {
          // get post like comment count
          const postView_count = await postServices.getLikeCommentCount(post_id);
          //push the post_id and postvcount to the postViewCounts
          for (const user_id of groupUsersIDs) {

            // if (!postServices.userLikeOrOwnPost(post_id,user_id)){
            if (true){
              postViewCounts.push({ post_id, "view_count" : postView_count });
              const like = await postServices.checkIfUserLikedPost(user_id, post_id);
                // console.log(`postController likeStatus :  ${like}`)
              postLikesData.push({ user_id, post_id, like});

            }
           
          }
        }
      }


    //   console.log("postLikesData: " +  JSON.stringify(postLikesData, null, 2));
    //   console.log("postViewCounts : " +  JSON.stringify(postViewCounts, null, 2));

      if (!postLikesData.length || !postViewCounts.length){
        let msg =` please join groups first postLikesData ${postLikesData.length} \n postViewCounts${postViewCounts.length} `
        console.log(msg)
        return {"ok":0, msg}
      }



      //const resData   = await axios.post("http://127.0.0.1:8000/posts/likes/", postLikesData);
      const resData= await postServices.sendPostsData("likes",postLikesData)
      console.log("postLikesData -> resData: " + resData);
      //test resdata if not 1 res with erorr
      if(!resData){
        let msg = 'ML server erorr with  postLikesData' 
        console.log(msg)
        return {"ok":0, msg}
      } 



      // count view 

    //   console.log("postViewCounts : " +  JSON.stringify(postViewCounts, null, 2));

      const postViewCountsresData= await postServices.sendPostsData("viewcounts",postViewCounts)  
      // console.log("postViewCounts resData: " + postViewCountsresData);
      if(!postViewCountsresData){
        let msg = 'ML server erorr with  postViewCountsresData'
        console.log(msg)
        return {"ok":0, msg}
      } 




      let msg = " data sent to ml successfully"
    //   console.log(msg)
      return {"ok":1, msg}


    }catch(err){
        console.log("erorr test  post recom controllor : "+ err)
        return {ok: 0, msg: "server internal erorr"}
    }
 

}




module.exports = 
{
    createPost,
    readAllPosts,
    readPost,
    readUserPosts,
    updatePost,
    updateMLData,
    likePost,
    unlikePost,
    reportPost,
    deletePost,
    searchPosts,
    getRecommendedPosts
}