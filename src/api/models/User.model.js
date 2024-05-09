const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    
      
      //  general data. 


      role :        { type: mongoose.Schema.Types.ObjectId,ref: 'UserRole'},
      // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
      profilePhoto: { type: String }, // URL or file path
      coverPhoto:   { type: String }, // URL or file path
      //displayName:  { type: String , required: true, match: /^[a-zA-Z\s]+$/, },   //fisrt & last  name 

      email:        { type: String, required: true, match: /^\S+@\S+\.\S+$/, unique: true },
      
      firstLogin:   { type: Boolean, default: true, }, // to give the user tour // have to change after first time 
      firstName:    { type: String  }, // required
      lastName:     { type: String,   }, //required
      username:     { type: String, },   // disclude (no ' - ' no'/ \' no '<>'  ) //required
      gender:       { type: String, enum: ["female", "male"]},
      birthDate:    { type: String, },
      phone:        [{type: String}], // include num only and use country code.
      nationality:  { type: String},  // 
      firebaseID:   { type: String}, // from Firebase
      //security 
  
      password :               {type:String, required: true, },//required:true  required:true
      sessionToken:            {type:String},
      emailVerifcationToken :  {type:String},
      isEmailVerified:         {type:Boolean, default: false},






      // functionality data 
      /////////////////////////////////////////////////////////////////////
      profileVisibility:    {  type: String }, // Public, Private, Protected
      categoricalInterests: [{ type: String }],

      createdPosts:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Reference to posts
      savedPosts:           [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Reference to saved posts
      interestedPost:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
      dayRecommendedPosts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // daily change using the machine learnin model
      joinedTodoLists:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }], // Reference to to-do lists
      createdTodoLists:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }], // Reference to to-do lists
     
      // time tracking:
      

      // gamification features  
      achievements:         [{ type: String }], // List of achievements or points
      rank:                 {  type: String }, // User's rank
      
      followers:            [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to followers // temp for upcomming features 
      following:            [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to users being followed //temp for upcomming features
      


      // Settings and Privacy Module

      // Account Activity
  },
  {
    timestamps: true,
  }
);



const UserProfileModel = mongoose.model("User", UserProfileSchema);



module.exports = UserProfileModel;