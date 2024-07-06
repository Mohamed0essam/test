const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  // role :        { type: mongoose.Schema.Types.ObjectId,ref: 'UserRole'},
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  //displayName:  { type: String , required: true, match: /^[a-zA-Z\s]+$/, },   //fisrt & last  name 


  profilePhoto: {type: String},                                                                   // URL or file path
  coverPhoto: {type: String},                                                                     // URL or file path
  email: {type: String, required: true, lowercase: true, match: /^\S+@\S+\.\S+$/, unique: true},
  firstLogin: {type: Boolean, default: true},                                                     // to give the user tour | have to change after first time 
  firstName: {type: String},                                                                      // required
  lastName: {type: String},                                                                       // required
  username: {type: String},                                                                       // disclude (no ' - ' no'/ \' no '<>'  ) //required
  gender: {type: String, enum: ["female", "male"]},
  birthDate: {type: String},
  phone: {type: String, default: "empty"},                                                            // include num only and use country code.
  nationality: {type: String},  
  firebaseID: {type: String},                                                                     // from Firebase
      

  //security 
  password : {type: String, required: true},                                                      // required:true  required:true
  session: {type:String, unique: true},                                                         // Will be hashed
  authenticationKey: {type: String, unique: true, required: false},                             // Will be hashed
  deviceToken: {type: String, required: false, default: "empty"},
  emailVerifcationToken : {type:String},
  isEmailVerified: {type:Boolean, default: false},



  // functionality data 
  profileVisibility: {type: Boolean, required: true, default: true},                              // Public, Private, Protected
  createdPosts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],                            // Reference to posts
  savedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],                              // Reference to saved posts
  likedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
  dailyRecommendedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],                   // daily change using the machine learnin model
  joinedTodoLists: [{type: mongoose.Schema.Types.ObjectId, ref: "Group"}],                        // Reference to to-do lists
  createdTodoLists: [{type: mongoose.Schema.Types.ObjectId, ref: "Group"}],                       // Reference to to-do lists
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],                               // Reference to followers 
  following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],                               // Reference to users being followed 
  isOnline: {type: Boolean, required: true, default: false},
  // completedDays -> days, dates + task and group names
  
  // time tracking:
      

  // gamification features  
  achievements: [{type: String}],                                                                 // List of achievements or points
  rank: {type: String},                                                                           // User's rank
      


  // Settings and Privacy Module

  // Account Activity
  },
  {
    timestamps: true,
  }
);



const UserProfileModel = mongoose.model("User", UserProfileSchema);



module.exports = UserProfileModel;